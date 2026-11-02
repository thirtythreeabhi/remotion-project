#!/usr/bin/env python3
"""Coffeemium voiceover timing.
With ELEVENLABS_API_KEY: request genuine forced-alignment word timestamps.
Without a key: find pause midpoints with FFmpeg and generate frame-aligned scenes.
Pause-derived markers are NOT word-level forced alignment.
"""
import json, os, re, subprocess, urllib.request, uuid
from pathlib import Path

BASE=Path(__file__).resolve().parent
AUDIO=BASE/"public/coffeemium/narration.mp3"
TRANSCRIPT=BASE/"coffeemium-transcript.txt"
OUT=BASE/"out/Coffeemium-voice-alignment.json"
FPS=30
# These are the EXACT frame boundaries of the rendered Remotion composition.
RENDER_CUTS=[0,109,326,533,722,908,1041,1246,1375,1480]
SCENES=[
 ("opening_hook",0.0,3.64),
 ("brand_reveal",3.64,10.87),
 ("catalog",10.87,17.77),
 ("coffee_finder",17.77,24.07),
 ("product_customization",24.07,30.27),
 ("bundles_checkout",30.27,34.70),
 ("admin_stack",34.70,41.53),
 ("developer_identity",41.53,45.83),
 ("fiverr_cta",45.83,49.319125),
]
def align_remote(audio, transcript, key):
    boundary="----Remotion"+uuid.uuid4().hex
    pieces=[]
    def part(name, data, filename=None, ctype=None):
        hdr=['--'+boundary,'Content-Disposition: form-data; name="'+name+'"'+('; filename="'+filename+'"' if filename else '')]
        if ctype: hdr+=['Content-Type: '+ctype]
        pieces.append(('\r\n'.join(hdr)+'\r\n\r\n').encode()+data+b'\r\n')
    part("file",audio.read_bytes(),audio.name,"audio/mpeg")
    part("text",transcript.encode())
    body=b''.join(pieces)+('--'+boundary+'--\r\n').encode()
    req=urllib.request.Request("https://api.elevenlabs.io/v1/forced-alignment",data=body,headers={"xi-api-key":key,"Content-Type":"multipart/form-data; boundary="+boundary},method="POST")
    with urllib.request.urlopen(req,timeout=180) as response:return json.loads(response.read())
def silences(audio):
    proc=subprocess.run(["ffmpeg","-hide_banner","-i",str(audio),"-af","silencedetect=noise=-33dB:d=0.18","-f","null","-"],capture_output=True,text=True,check=False)
    starts=[float(m.group(1)) for m in re.finditer(r"silence_start: (\d+(?:\.\d+)?)",proc.stderr)]
    ends=[float(m.group(1)) for m in re.finditer(r"silence_end: (\d+(?:\.\d+)?)",proc.stderr)]
    return [{"start":a,"end":b,"mid":round((a+b)/2,5)} for a,b in zip(starts,ends)]
def main():
    duration=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",str(AUDIO)],text=True).strip())
    detected=silences(AUDIO)
    key=os.environ.get("ELEVENLABS_API_KEY","")
    transcript=TRANSCRIPT.read_text(encoding="utf-8").strip()
    raw=None
    if key:
        raw=align_remote(AUDIO,transcript,key)
        method="elevenlabs_word_forced_alignment"
    else:
        method="ffmpeg_silence_pause_alignment_only"
    scenes=[]
    for i,(name,_,_) in enumerate(SCENES):
        a=round(RENDER_CUTS[i]/FPS,6)
        b=round(RENDER_CUTS[i+1]/FPS,6)
        marker=min(detected,key=lambda d:abs(d['mid']-b)) if i<len(SCENES)-1 else None
        scenes.append({'id':name,'start_seconds':a,'end_seconds':b,'start_frame':RENDER_CUTS[i],'end_frame':RENDER_CUTS[i+1],'duration_frames':RENDER_CUTS[i+1]-RENDER_CUTS[i],'nearest_pause_seconds':marker['mid'] if marker else None,'pause_offset_seconds':round(b-marker['mid'],4) if marker else None})
    data={"audio_file":AUDIO.name,"duration_seconds":duration,"fps":FPS,"alignment_method":method,"true_word_timestamps_available":raw is not None,"note":"Scene frames are EXACT for this video and are positioned near measured voice pauses. Without API credentials, only pause detection is possible; no exact word alignment is claimed.","scenes":scenes,"measured_silences":detected}
    if raw is not None:
        data["forced_alignment"]=raw
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(data,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("Method:",method)
    print("Duration:",duration,"seconds")
    for s in scenes:print(s["id"],s["start_seconds"],"→",s["end_seconds"],"(",s["start_frame"],"-",s["end_frame"],"frames)")
    print("Saved:",OUT)
if __name__=="__main__":main()
