#!/usr/bin/env python3
"""Read-only local dashboard for the phone photo organizer job."""

from __future__ import annotations

import json
import mimetypes
import subprocess
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse

from PIL import Image, ImageOps
from io import BytesIO


STATE_PATH = Path.home() / ".local/state/phone-photo-organizer/plan.json"
WORKFLOW_PATH = Path.home() / ".local/state/phone-photo-organizer/workflow.json"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff", ".heic", ".heif", ".avif"}
HOST = "127.0.0.1"
PORT = 8765

_inventory_lock = threading.Lock()
_inventory = {"folder": None, "checked": 0.0, "count": 0, "error": None}


def user_service_active(unit: str) -> bool:
    try:
        result = subprocess.run(
            ["systemctl", "--user", "is-active", unit],
            capture_output=True,
            text=True,
            timeout=3,
            check=False,
        )
        return result.returncode == 0 and result.stdout.strip() == "active"
    except Exception:
        return False


def ollama_model_available(model: str) -> bool:
    try:
        result = subprocess.run(
            [str(Path.home() / ".local/bin/ollama"), "show", model],
            capture_output=True,
            text=True,
            timeout=3,
            check=False,
        )
        return result.returncode == 0
    except Exception:
        return False


def photo_count(folder: Path) -> tuple[int, str | None]:
    folder_key = str(folder)
    with _inventory_lock:
        if _inventory["folder"] == folder_key and time.time() - _inventory["checked"] < 20:
            return int(_inventory["count"]), _inventory["error"]
        try:
            count = sum(
                1
                for entry in folder.rglob("*")
                if entry.is_file()
                and entry.suffix.lower() in IMAGE_EXTS
                and not entry.name.endswith(".metadata.json")
            )
            error = None
        except Exception as exc:
            count = int(_inventory["count"]) if _inventory["folder"] == folder_key else 0
            error = str(exc)
        _inventory.update(folder=folder_key, checked=time.time(), count=count, error=error)
        return count, error


def camera_file(folder: Path, filename: str) -> Path | None:
    # Only serve image files beneath the mounted Camera folder.
    relative = Path(filename)
    if not filename or relative.is_absolute() or ".." in relative.parts:
        return None
    path = folder / relative
    try:
        path.resolve().relative_to(folder.resolve())
        if path.suffix.lower() not in IMAGE_EXTS or not path.is_file():
            return None
        return path
    except OSError:
        return None


def thumbnail(path: Path, max_edge: int = 720) -> bytes:
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((max_edge, max_edge))
        out = BytesIO()
        image.save(out, "JPEG", quality=82, optimize=True)
        return out.getvalue()


class DashboardHandler(BaseHTTPRequestHandler):
    server_version = "PhonePhotoDashboard/1.0"

    def log_message(self, _format: str, *_args) -> None:
        return

    def respond(self, status: int, body: bytes, content_type: str, cache: str = "no-store") -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/":
            html_path = Path(__file__).with_name("photo_organizer_dashboard.html")
            try:
                self.respond(200, html_path.read_bytes(), "text/html; charset=utf-8")
            except OSError as exc:
                self.respond(500, str(exc).encode(), "text/plain; charset=utf-8")
            return

        if parsed.path == "/api/status":
            self.serve_status()
            return

        if parsed.path == "/api/thumb":
            self.serve_thumbnail(parse_qs(parsed.query))
            return

        self.respond(404, b"Not found", "text/plain; charset=utf-8")

    def serve_status(self) -> None:
        try:
            state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
            folder = Path(state["folder"])
            items = list(state.get("items", {}).values())
            complete = [item for item in items if item.get("status") == "complete"]
            total, inventory_error = photo_count(folder)
            recent = []
            for item in reversed(items):
                if item.get("status") != "complete":
                    continue
                destination = Path(item.get("destination", ""))
                relative = destination.relative_to(folder).as_posix()
                recent.append(
                    {
                        "filename": destination.name,
                        "title": item.get("metadata", {}).get("title", destination.stem),
                        "description": item.get("metadata", {}).get("description", ""),
                        "keywords": item.get("metadata", {}).get("keywords", []),
                        "thumbnail": "/api/thumb?file=" + quote(relative, safe=""),
                    }
                )
                if len(recent) >= 24:
                    break
            running = user_service_active("phone-photo-organizer.service")
            pending = max(total - len(complete), 0)
            model_id = state.get("model_id", "qwen3-vl:8b-instruct")
            model_ready = ollama_model_available(model_id)
            try:
                workflow = json.loads(WORKFLOW_PATH.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                workflow = {}
            phase = workflow.get("phase")
            if not running:
                job = "paused" if pending else "complete"
            elif phase == "sorting":
                job = "sorting"
            elif phase == "preparing" or not model_ready:
                job = "preparing"
            else:
                job = "running"
            data = {
                "ok": True,
                "job": job,
                "model": state.get("model", "Qwen3-VL 8B Instruct"),
                "sort_processed": workflow.get("sort_processed", 0),
                "sort_total": workflow.get("sort_total", 0),
                "processed": len(complete),
                "total": total,
                "pending": pending,
                "percent": round((len(complete) / total) * 100, 1) if total else 0,
                "inventory_error": inventory_error,
                "recent": recent,
                "updated": time.strftime("%H:%M:%S"),
            }
            payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self.respond(200, payload, "application/json; charset=utf-8")
        except Exception as exc:
            payload = json.dumps({"ok": False, "error": str(exc)}).encode("utf-8")
            self.respond(503, payload, "application/json; charset=utf-8")

    def serve_thumbnail(self, query: dict[str, list[str]]) -> None:
        try:
            state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
            folder = Path(state["folder"])
            filename = query.get("file", [""])[0]
            path = camera_file(folder, filename)
            if path is None:
                self.respond(404, b"Photo not found", "text/plain; charset=utf-8")
                return
            body = thumbnail(path)
            self.respond(200, body, "image/jpeg", "private, max-age=3600")
        except Exception:
            self.respond(404, b"Preview unavailable", "text/plain; charset=utf-8")


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), DashboardHandler)
    server.daemon_threads = True
    print(f"Photo organizer dashboard: http://{HOST}:{PORT}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
