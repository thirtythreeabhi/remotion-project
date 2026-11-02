#!/usr/bin/env python3
"""Caption and organize phone camera images with a local Ollama vision model.

Default mode creates a resumable local plan only. Pass --apply to rename files
on the phone and write matching JSON metadata sidecars. Original image bytes
and embedded EXIF metadata are left untouched.
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    Image = None
    ImageOps = None


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff", ".heic", ".heif", ".avif"}
STATE_PATH = Path(os.environ.get("XDG_STATE_HOME", Path.home() / ".local/state")) / "phone-photo-organizer/plan.json"


def read_state(path: Path, folder: Path) -> dict:
    if path.exists():
        try:
            state = json.loads(path.read_text(encoding="utf-8"))
            if state.get("folder") == str(folder):
                return state
        except (OSError, json.JSONDecodeError):
            pass
    return {"folder": str(folder), "items": {}}


def save_state(path: Path, state: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def retry(operation, label: str, attempts: int = 4):
    for attempt in range(attempts):
        try:
            return operation()
        except Exception as error:
            if attempt + 1 == attempts:
                raise
            delay = min(3 * (2 ** attempt), 15)
            print(f"Retrying {label} in {delay}s after: {error}", file=sys.stderr, flush=True)
            time.sleep(delay)


def needs_metadata_refresh(item: dict) -> bool:
    keywords = item.get("metadata", {}).get("keywords", [])
    return item.get("metadata_schema_version") != 3 or not isinstance(keywords, list) or len(keywords) != 5


def exif_capture_time(path: Path) -> str | None:
    if Image is None:
        return None
    try:
        with Image.open(path) as image:
            exif = image.getexif()
            value = exif.get(36867) or exif.get(306)  # DateTimeOriginal or DateTime
        if value:
            parsed = dt.datetime.strptime(str(value), "%Y:%m:%d %H:%M:%S")
            return parsed.isoformat(timespec="seconds")
    except Exception:
        pass
    return None


def capture_date(path: Path) -> str:
    value = exif_capture_time(path)
    if value:
        return value[:10]
    try:
        stamp = path.stat().st_mtime
        if stamp > 946684800:  # Ignore MTP's common 1970 placeholder timestamp.
            return dt.datetime.fromtimestamp(stamp).date().isoformat()
    except OSError:
        pass
    return "undated"


def model_image_bytes(path: Path) -> bytes:
    if Image is not None:
        try:
            with Image.open(path) as image:
                image = ImageOps.exif_transpose(image).convert("RGB")
                image.thumbnail((1024, 1024))
                from io import BytesIO

                output = BytesIO()
                image.save(output, format="JPEG", quality=88, optimize=True)
                return output.getvalue()
        except Exception:
            pass
    # Fallback for formats Pillow cannot decode, such as some HEIC variants.
    import subprocess
    import tempfile

    with tempfile.TemporaryDirectory(prefix="phone-photo-") as tmpdir:
        converted = Path(tmpdir) / "preview.jpg"
        subprocess.run(
            ["ffmpeg", "-v", "error", "-i", str(path), "-frames:v", "1", "-vf", "scale='min(1024,iw)':-2", str(converted)],
            check=True,
            timeout=60,
        )
        return converted.read_bytes()


def describe(path: Path, endpoint: str, model: str) -> dict:
    image_data = base64.b64encode(model_image_bytes(path)).decode("ascii")
    prompt = (
        "/no_think\n"
        "Write useful, specific photo catalog metadata. Describe only what is clearly visible; "
        "do not guess names, identities, ages, relationships, exact place, event, or date. Refer "
        "to people neutrally. Never transcribe names, addresses, ID numbers, account details, or "
        "license plates. For a photo with people, describe their visible clothing, pose, activity, "
        "position in the frame, and distinctive visible surroundings. For other photos, describe "
        "the main subject, its action or arrangement, setting, and useful visual details. Mention "
        "framing (such as close-up, group portrait, or wide view) when it helps distinguish this "
        "image from similar shots. Do not repeat the same generic title when visible details allow "
        "a more specific one. Return a concise 5-10 word title naming the subject and distinguishing "
        "visual detail; a factual 30-50 word description with concrete details and no filler; and "
        "exactly 5 concise, non-redundant keywords grounded in visible content. If a detail is "
        "uncertain, leave it out rather than inventing it."
    )
    payload = {
        "model": model,
        "stream": False,
        "think": False,
        "format": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "maxLength": 80},
                "description": {"type": "string", "maxLength": 200},
                "keywords": {
                    "type": "array",
                    "items": {"type": "string", "maxLength": 40},
                    "minItems": 5,
                    "maxItems": 5,
                },
            },
            "required": ["title", "description", "keywords"],
        },
        "options": {"temperature": 0.15, "num_ctx": 3072, "num_predict": 384},
        "messages": [{"role": "user", "content": prompt, "images": [image_data]}],
    }
    request = urllib.request.Request(
        endpoint.rstrip("/") + "/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=300) as response:
        model_response = json.loads(response.read().decode("utf-8"))
    message = model_response.get("message", {})
    answer = message.get("content", "")
    try:
        result = json.loads(answer)
    except json.JSONDecodeError as error:
        thinking = message.get("thinking", "")
        raise ValueError(
            f"Model returned invalid JSON: {answer[:500]!r}; "
            f"thinking: {str(thinking)[:500]!r}; message fields: {sorted(message)}; "
            f"done_reason: {model_response.get('done_reason')}"
        ) from error
    title = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", str(result.get("title", "Photo")))
    title = " ".join(title.split())[:80]
    description = " ".join(str(result.get("description", "")).split())[:500]
    keywords = result.get("keywords", [])
    if not isinstance(keywords, list):
        keywords = []
    return {
        "title": title or "Photo",
        "description": description,
        "keywords": [" ".join(str(tag).split())[:60] for tag in keywords[:8] if str(tag).strip()],
    }


def slug(value: str) -> str:
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", value)
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return (value or "photo")[:64].strip("-") or "photo"


def needs_descriptive_filename(path: Path) -> bool:
    stem = path.stem.strip()
    return bool(
        re.match(r"^(?:IMG|PXL|DSC|CAM|MVIMG|VID)_?\d|^\d{10,}|^20\d{6}_\d{6}", stem, re.IGNORECASE)
        or stem.lower() in {"image", "photo", "picture"}
    )


def unique_destination(folder: Path, name: str, ignore: Path | None = None) -> Path:
    candidate = folder / name
    index = 2
    while candidate.exists() and candidate != ignore:
        candidate = folder / f"{Path(name).stem}-{index}{Path(name).suffix}"
        index += 1
    return candidate


def apply_item(item: dict, model: str, exiftool: str) -> None:
    source = Path(item["source"])
    destination = Path(item["destination"])
    sidecar = destination.with_name(destination.name + ".metadata.json")
    if source.exists():
        if destination.exists() and source != destination:
            raise FileExistsError(f"Refusing to overwrite existing file: {destination.name}")
        if source != destination:
            source.rename(destination)
    elif not destination.exists():
        raise FileNotFoundError(f"Neither original nor planned file exists: {source.name}")

    if exiftool:
        import subprocess

        stale_temp = destination.with_name(destination.name + "_exiftool_tmp")
        if stale_temp.exists():
            if not destination.exists():
                raise FileNotFoundError(f"Cannot clear stale metadata temp without the original image: {destination.name}")
            stale_temp.unlink()

        command = [
            exiftool,
            "-overwrite_original_in_place",
            f"-XMP-dc:Title={item['metadata']['title']}",
            f"-XMP-dc:Description={item['metadata']['description']}",
        ]
        keywords = item["metadata"]["keywords"]
        if keywords:
            command.append(f"-XMP-dc:Subject={keywords[0]}")
            command.extend(f"-XMP-dc:Subject+={tag}" for tag in keywords[1:])
        command.append(str(destination))
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, timeout=120)

    metadata = {
        **item["metadata"],
        "original_filename": item["original_filename"],
        "capture_time": item.get("capture_time"),
        "model": model,
        "metadata_note": "Description and keywords generated locally; embedded XMP added without changing image pixels.",
    }
    sidecar.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("folder", type=Path, help="Phone DCIM/Camera folder")
    parser.add_argument("--model", default="qwen3-vl:4b-instruct")
    parser.add_argument("--endpoint", default="http://127.0.0.1:11434")
    parser.add_argument("--plan", type=Path, default=STATE_PATH)
    parser.add_argument("--exiftool", default=os.environ.get("EXIFTOOL", str(Path.home() / ".local/bin/exiftool")))
    parser.add_argument("--max-items", type=int, help="Process at most this many images in this invocation")
    parser.add_argument("--unload-every", type=int, default=20, help="Unload the model after this many newly completed images")
    parser.add_argument("--apply", action="store_true", help="Rename phone files and create JSON metadata sidecars")
    args = parser.parse_args()
    folder = args.folder
    if args.apply and not Path(args.exiftool).exists():
        print(f"ExifTool is required to embed metadata. Expected executable: {args.exiftool}", file=sys.stderr)
        return 2
    if not folder.is_dir():
        print(f"Camera folder is not accessible: {folder}", file=sys.stderr)
        return 2

    state = read_state(args.plan, folder)
    model_label = args.model.replace("qwen3-vl:", "Qwen3-VL ").replace("-instruct", " Instruct")
    state["model"] = model_label
    state["model_id"] = args.model
    files = sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS and not p.name.endswith(".metadata.json"))
    if args.max_items is not None:
        files = files[:max(0, args.max_items)]
    if not files:
        print("No supported images found.")
        return 0
    print(f"Found {len(files)} images. {'Applying plan' if args.apply else 'Creating/resuming local plan'}.", flush=True)

    destinations = {Path(item["destination"]): item for item in state["items"].values()}
    completed_this_run = 0
    for number, path in enumerate(files, 1):
        # Resume safely if a previous run renamed a file but did not finish its sidecar.
        planned_destination = destinations.get(path)
        if planned_destination:
            refresh = needs_metadata_refresh(planned_destination)
            if refresh:
                planned_destination["metadata"] = retry(
                    lambda: describe(path, args.endpoint, args.model),
                    f"caption refresh for {path.name}",
                )
                # Rebuild autogenerated names from the improved title. Keep user-named files.
                if needs_descriptive_filename(Path(planned_destination["original_filename"])):
                    stamp = planned_destination.get("capture_time") or exif_capture_time(path)
                    date = stamp[:10] if stamp else capture_date(path)
                    name = f"{date}_{slug(planned_destination['metadata']['title'])}{path.suffix.lower()}"
                    new_destination = unique_destination(folder, name, ignore=path)
                    if new_destination != path:
                        planned_destination["source"] = str(path)
                        planned_destination["destination"] = str(new_destination)
                planned_destination["metadata_schema_version"] = 3
                save_state(args.plan, state)
            if args.apply and (planned_destination.get("status") != "complete" or refresh):
                try:
                    retry(
                        lambda: apply_item(planned_destination, args.model, args.exiftool),
                        f"metadata write for {path.name}",
                    )
                    planned_destination["status"] = "complete"
                    save_state(args.plan, state)
                    completed_this_run += 1
                    if args.unload_every > 0 and completed_this_run % args.unload_every == 0:
                        import subprocess

                        subprocess.run([str(Path.home() / ".local/bin/ollama"), "stop", args.model], check=False, timeout=60, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                        print(f"Unloaded {args.model} after {completed_this_run} images to release memory.", flush=True)
                except Exception as error:
                    print(f"[{number}/{len(files)}] SKIPPED {path.name}: {error}", file=sys.stderr, flush=True)
            continue
        key = path.name
        item = state["items"].get(key)
        try:
            if not item or item.get("size") != path.stat().st_size or needs_metadata_refresh(item):
                metadata = retry(lambda: describe(path, args.endpoint, args.model), f"caption for {path.name}")
                stamp = exif_capture_time(path)
                date = stamp[:10] if stamp else capture_date(path)
                if needs_descriptive_filename(path):
                    destination = unique_destination(folder, f"{date}_{slug(metadata['title'])}{path.suffix.lower()}")
                else:
                    destination = path
                item = {
                    "original_filename": key,
                    "source": str(path),
                    "destination": str(destination),
                    "size": path.stat().st_size,
                    "capture_time": stamp,
                    "metadata": metadata,
                    "metadata_schema_version": 3,
                    "status": "planned",
                }
                state["items"][key] = item
                save_state(args.plan, state)
            if args.apply and item.get("status") != "complete":
                retry(
                    lambda: apply_item(item, args.model, args.exiftool),
                    f"metadata write for {path.name}",
                )
                item["status"] = "complete"
                save_state(args.plan, state)
                completed_this_run += 1
                if args.unload_every > 0 and completed_this_run % args.unload_every == 0:
                    import subprocess

                    subprocess.run([str(Path.home() / ".local/bin/ollama"), "stop", args.model], check=False, timeout=60, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    print(f"Unloaded {args.model} after {completed_this_run} images to release memory.", flush=True)
            print(f"[{number}/{len(files)}] {key} -> {Path(item['destination']).name}: {item['metadata']['title']}", flush=True)
        except Exception as error:
            print(f"[{number}/{len(files)}] SKIPPED {key}: {error}", file=sys.stderr, flush=True)
    print(f"Plan/manifest: {args.plan}")
    if not args.apply:
        print("No phone files were changed. Review the plan, then rerun with --apply to rename and write sidecars.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
