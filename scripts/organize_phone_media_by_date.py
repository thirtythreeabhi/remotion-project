#!/usr/bin/env python3
"""Move camera photos and videos into Camera/YYYY/MM using capture dates.

Default mode writes a reviewable local plan. Pass --apply to move media on the
phone; image JSON sidecars are kept beside their images. Other phone files are
not touched.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff", ".heic", ".heif", ".avif"}
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".3gp", ".3g2", ".mkv", ".avi", ".webm"}
STATE_PATH = Path(os.environ.get("XDG_STATE_HOME", Path.home() / ".local/state")) / "phone-photo-organizer/media-by-date.json"
WORKFLOW_PATH = Path(os.environ.get("XDG_STATE_HOME", Path.home() / ".local/state")) / "phone-photo-organizer/workflow.json"
CAPTURE_NAME = re.compile(r"(?<!\d)(20\d{2})(\d{2})(\d{2})[_ -]?(\d{2})(\d{2})(\d{2})(?!\d)")


def save_plan(path: Path, state: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def save_workflow(phase: str, processed: int = 0, total: int = 0) -> None:
    state = {"phase": phase, "sort_processed": processed, "sort_total": total,
             "updated": dt.datetime.now().astimezone().isoformat(timespec="seconds")}
    save_plan(WORKFLOW_PATH, state)


def exif_date(path: Path) -> dt.datetime | None:
    if Image is None:
        return None
    try:
        with Image.open(path) as image:
            exif = image.getexif()
            value = exif.get(36867) or exif.get(306)
        if value:
            return dt.datetime.strptime(str(value), "%Y:%m:%d %H:%M:%S")
    except Exception:
        pass
    return None


def video_date(path: Path) -> dt.datetime | None:
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format_tags=creation_time:stream_tags=creation_time", "-of", "json", str(path)],
            capture_output=True,
            text=True,
            timeout=30,
            check=True,
        )
        data = json.loads(result.stdout)
        values = []
        format_value = data.get("format", {}).get("tags", {}).get("creation_time")
        if format_value:
            values.append(format_value)
        for stream in data.get("streams", []):
            value = stream.get("tags", {}).get("creation_time")
            if value:
                values.append(value)
        for value in values:
            try:
                stamp = dt.datetime.fromisoformat(str(value).replace("Z", "+00:00"))
                return stamp.astimezone().replace(tzinfo=None) if stamp.tzinfo else stamp
            except ValueError:
                continue
    except Exception:
        pass
    return None


def filename_date(path: Path) -> dt.datetime | None:
    match = CAPTURE_NAME.search(path.stem)
    if not match:
        return None
    try:
        return dt.datetime(*(int(part) for part in match.groups()))
    except ValueError:
        return None


def capture_time(path: Path, known: str | None = None) -> tuple[str | None, str | None]:
    if known:
        try:
            return dt.datetime.fromisoformat(known.replace("Z", "+00:00")).date().isoformat(), "photo manifest"
        except ValueError:
            pass
    stamp = exif_date(path) if path.suffix.lower() in IMAGE_EXTS else video_date(path)
    source = "image EXIF" if path.suffix.lower() in IMAGE_EXTS else "video metadata"
    if stamp is None:
        stamp = filename_date(path)
        source = "filename timestamp"
    if stamp is None:
        try:
            mtime = path.stat().st_mtime
            if mtime > 946684800:
                stamp = dt.datetime.fromtimestamp(mtime)
                source = "file modified time (fallback)"
        except OSError:
            pass
    return (stamp.date().isoformat(), source) if stamp else (None, None)


def unique_path(candidate: Path, reserved: set[Path]) -> Path:
    result = candidate
    index = 2
    while result.exists() or result in reserved:
        result = candidate.with_name(f"{candidate.stem}-{index}{candidate.suffix}")
        index += 1
    reserved.add(result)
    return result


def create_plan(folder: Path, manifest_path: Path) -> dict:
    manifest = {}
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            manifest = {}
    known_dates = {}
    for item in manifest.get("items", {}).values():
        destination = item.get("destination")
        stamp = item.get("capture_time")
        if destination and stamp:
            known_dates[str(Path(destination).resolve())] = stamp
    reserved: set[Path] = set()
    items = []
    undated = []
    for source in sorted(folder.iterdir(), key=lambda p: p.name.casefold()):
        if not source.is_file() or source.name.endswith(".metadata.json") or "_exiftool_tmp" in source.name:
            continue
        suffix = source.suffix.lower()
        if suffix not in IMAGE_EXTS | VIDEO_EXTS:
            continue
        date, date_source = capture_time(source, known_dates.get(str(source.resolve())))
        if not date:
            undated.append(source.name)
            continue
        year, month, _ = date.split("-")
        destination = unique_path(folder / year / month / source.name, reserved)
        sidecar = source.with_name(source.name + ".metadata.json") if suffix in IMAGE_EXTS else None
        sidecar_destination = destination.with_name(destination.name + ".metadata.json") if sidecar and sidecar.exists() else None
        items.append({
            "source": str(source),
            "destination": str(destination),
            "sidecar_source": str(sidecar) if sidecar and sidecar.exists() else None,
            "sidecar_destination": str(sidecar_destination) if sidecar_destination else None,
            "size": source.stat().st_size,
            "capture_date": date,
            "date_source": date_source,
            "status": "planned",
        })
    return {"folder": str(folder), "items": items, "undated": undated}


def apply_plan(plan_path: Path, plan: dict, manifest_path: Path) -> None:
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        manifest = {}
    total = len(plan["items"])
    processed = sum(1 for item in plan["items"] if item.get("status") == "complete")
    save_workflow("sorting", processed, total)
    for number, item in enumerate(plan["items"], 1):
        source = Path(item["source"])
        destination = Path(item["destination"])
        if item.get("status") == "complete" and destination.exists():
            continue
        if source.exists():
            if source.stat().st_size != item["size"]:
                raise RuntimeError(f"Source changed since planning; stopping safely: {source}")
            destination.parent.mkdir(parents=True, exist_ok=True)
            if destination.exists():
                raise FileExistsError(f"Refusing to overwrite: {destination}")
            source.rename(destination)
        elif not destination.exists():
            raise FileNotFoundError(f"Neither original nor planned media file exists: {source}")
        side_source = Path(item["sidecar_source"]) if item.get("sidecar_source") else None
        side_destination = Path(item["sidecar_destination"]) if item.get("sidecar_destination") else None
        if side_source and side_destination and side_source.exists():
            side_destination.parent.mkdir(parents=True, exist_ok=True)
            if side_destination.exists():
                raise FileExistsError(f"Refusing to overwrite sidecar: {side_destination}")
            side_source.rename(side_destination)
        item["status"] = "complete"
        processed += 1

        for record in manifest.get("items", {}).values():
            if record.get("destination") == str(source):
                record["source"] = str(destination)
                record["destination"] = str(destination)
                break
        save_plan(plan_path, plan)
        save_workflow("sorting", processed, total)
        if manifest:
            save_plan(manifest_path, manifest)
        print(f"[{number}/{len(plan['items'])}] {source.name} -> {destination.relative_to(Path(plan['folder']))}", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("folder", type=Path, help="Phone DCIM/Camera folder")
    parser.add_argument("--manifest", type=Path, default=Path.home() / ".local/state/phone-photo-organizer/plan.json")
    parser.add_argument("--plan", type=Path, default=STATE_PATH)
    parser.add_argument("--apply", action="store_true", help="Move media into year/month folders on the phone")
    args = parser.parse_args()
    folder = args.folder
    if not folder.is_dir():
        print(f"Camera folder is not accessible: {folder}", file=sys.stderr)
        return 2
    if args.plan.exists():
        try:
            plan = json.loads(args.plan.read_text(encoding="utf-8"))
            if plan.get("folder") != str(folder):
                plan = create_plan(folder, args.manifest)
        except (OSError, json.JSONDecodeError):
            plan = create_plan(folder, args.manifest)
    else:
        plan = create_plan(folder, args.manifest)
    save_plan(args.plan, plan)
    print(f"Planned {len(plan['items'])} camera photos/videos into year/month folders; {len(plan['undated'])} undated files will stay in place.", flush=True)
    if plan["undated"]:
        print("Undated examples: " + ", ".join(plan["undated"][:8]), flush=True)
    if not args.apply:
        print(f"Reviewable plan: {args.plan}\nNo phone files were moved.")
        return 0
    apply_plan(args.plan, plan, args.manifest)
    save_workflow("complete", len(plan["items"]), len(plan["items"]))
    print("Date-based media organization complete.", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
