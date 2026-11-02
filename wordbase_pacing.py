#!/usr/bin/env python3
"""Add listening spaces at existing natural pauses without pitch or speed changes.
Source: original Wordbase Guddu voice-over.
All insertions are quantized to a 30 fps edit timeline.
"""
import json, re, subprocess, wave, os, math
from pathlib import Path

ROOT=Path('/home/deaktop-ubuntu/Downloads/remotion-project')
SOURCE=ROOT/'public/wordbase/narration.mp3'
DEST=ROOT/'public/wordbase/narration-paced.mp3'
MANIFEST=ROOT/'out/Wordbase-V3-pause-map.json'
TMPIN=ROOT/'out/.wordbase-original-48k.wav'
TMPOUT=ROOT/'out/.wordbase-paced-48k.wav'
FPS=30
# Major story transitions from the first cut. The pauses at these points get extra room.
CUTS=[0,151,319,422,630,768,901,1051,1251,1498,1656,1761,1891]
detection=subprocess.run(['ffmpeg','-hide_banner','-i',str(SOURCE),'-af','silencedetect=noise=-33dB:d=0.09','-f','null','-'],text=True,capture_output=True,check=False)
matches=re.findall(r'silence_start: ([\d.]+).*?\nsilencedetect.*?silence_end: ([\d.]+)',detection.stderr)
# Some ffmpeg versions prefix log lines with per-filter metadata; parse line-by-line.
segments=[]
start=None
for line in detection.stderr.splitlines():
  m=re.search(r'silence_start: ([\d.]+)',line)
  if m: start=float(m.group(1))
  m=re.search(r'silence_end: ([\d.]+)',line)
  if m and start is not None:
    end=float(m.group(1));segments.append((start,end));start=None
events=[]
for start,end in segments:
  dur=end-start
  mid=(start+end)/2
  if dur<0.26 or mid<1 or mid>62.5: continue
  nearest=min((abs(mid-c/FPS),c/FPS) for c in CUTS[1:-1])
  major=nearest[0]<.37
  # Shorter pauses: 0.32-0.40 extra; sentence stops: 0.55; chapter beats: 0.8.
  extra=.8 if major else (.55 if dur>=.40 else .40 if dur>=.32 else .32)
  frames=round(extra*FPS)
  events.append({'source_seconds':round(mid,6),'observed_silence_seconds':round(dur,3),'extra_frames':frames,'extra_seconds':round(frames/FPS,6),'major':major})
# Avoid two consecutive breaks that sound like stuttering.
out=[]
for event in events:
  if out and event['source_seconds']-out[-1]['source_seconds']<.87:
    prev=out[-1]
    if (event['major'],event['observed_silence_seconds'])>(prev['major'],prev['observed_silence_seconds']): out[-1]=event
    continue
  out.append(event)
events=out
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(SOURCE),'-ar','48000','-ac','2','-c:a','pcm_s16le',str(TMPIN)],check=True)
with wave.open(str(TMPIN),'rb') as wav:
  sample_rate=wav.getframerate()
  channels=wav.getnchannels()
  bpf=wav.getsampwidth()*channels
  frames_total=wav.getnframes()
  assert sample_rate==48000 and channels==2
  with wave.open(str(TMPOUT),'wb') as paced:
    paced.setparams(wav.getparams())
    at=0
    added=0
    for event in events:
      n=min(frames_total,max(0,round(event['source_seconds']*sample_rate)))
      paced.writeframes(wav.readframes(n-at))
      at=n
      # 30 fps / 48 kHz keeps every inserted break aligned to video.
      silent_frames=event['extra_frames']*(sample_rate//FPS)
      paced.writeframes(bytes(silent_frames*bpf))
      event['paced_start_seconds']=round(event['source_seconds']+added/FPS,6)
      added+=event['extra_frames']
      event['paced_end_seconds']=round(event['source_seconds']+added/FPS,6)
    paced.writeframes(wav.readframes(frames_total-at))
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(TMPOUT),'-c:a','libmp3lame','-b:a','192k',str(DEST)],check=True)
manifest={'source_mp3':str(SOURCE),'paced_mp3':str(DEST),'fps':FPS,'original_video_frames':1891,'total_inserted_frames':sum(x['extra_frames'] for x in events),'video_duration_frames':1891+sum(x['extra_frames'] for x in events),'original_audio_seconds':round(frames_total/sample_rate,3),'paced_audio_seconds':round(frames_total/sample_rate+sum(x['extra_seconds'] for x in events),3),'events':events,'method':'Voice activity gaps detected from original audio; add digital silence in existing gaps. No exact word transcript/forced alignment, sentence locations are inferred.'}
MANIFEST.write_text(json.dumps(manifest,indent=2))
TMPIN.unlink();TMPOUT.unlink()
print(json.dumps({'number_of_gaps':len(events),'original_audio_seconds':manifest['original_audio_seconds'],'paced_audio_seconds':manifest['paced_audio_seconds'],'output_frames':manifest['video_duration_frames'],'events':events},indent=2))
