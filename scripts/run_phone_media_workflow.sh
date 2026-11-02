#!/usr/bin/env bash
set -euo pipefail

MODEL="qwen3-vl:8b-instruct"
OLLAMA="/home/deaktop-ubuntu/.local/bin/ollama"
CAMERA="/run/user/1000/gvfs/mtp:host=SAMSUNG_SAMSUNG_Android_RZCX41FLBPH/Internal storage/DCIM/Camera"
PROJECT="/home/deaktop-ubuntu/Downloads/remotion-project"
WORKFLOW="${XDG_STATE_HOME:-$HOME/.local/state}/phone-photo-organizer/workflow.json"

set_phase() {
  local phase="$1"
  mkdir -p "$(dirname "$WORKFLOW")"
  printf '{"phase":"%s","updated":"%s"}\n' "$phase" "$(date -Iseconds)" > "$WORKFLOW.tmp"
  mv "$WORKFLOW.tmp" "$WORKFLOW"
}

set_phase "preparing"
while ! "$OLLAMA" show "$MODEL" >/dev/null 2>&1; do
  echo "Waiting for local model download: $MODEL" >&2
  sleep 30
done

set_phase "captioning"
/usr/bin/python3 -u "$PROJECT/scripts/organize_phone_camera.py" "$CAMERA" --apply --model "$MODEL"
/usr/bin/python3 -u "$PROJECT/scripts/organize_phone_media_by_date.py" "$CAMERA" --apply
set_phase "complete"
