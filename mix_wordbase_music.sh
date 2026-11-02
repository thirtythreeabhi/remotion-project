#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
INPUT="${1:-Wordbase-Portfolio-Abhijeet-V3-Paced.mp4}"
OUTPUT="${2:-Wordbase-Portfolio-Abhijeet-V4-Music.mp4}"
MUSIC="remotion-project/public/wordbase/wordbase-original-bed.wav"
ffmpeg -y -hide_banner -loglevel error \
  -i "$INPUT" -i "$MUSIC" \
  -filter_complex '[0:a]aformat=sample_fmts=fltp:channel_layouts=stereo,asplit=2[voice][side];[1:a]aformat=sample_fmts=fltp:channel_layouts=stereo,volume=0.64,afade=t=in:st=0:d=1.6,afade=t=out:st=72.8:d=3.4[bed];[bed][side]sidechaincompress=threshold=0.023:ratio=5:attack=25:release=450[duck];[voice][duck]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95:attack=5:release=50[a]' \
  -map 0:v:0 -map '[a]' -c:v copy -c:a aac -b:a 192k \
  -movflags +faststart "$OUTPUT"
printf 'Created %s\n' "$OUTPUT"
