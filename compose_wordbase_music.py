#!/usr/bin/env python3
"""Compose an original, gentle Wordbase soundtrack with no external music.
Small warm keys, atmospheric suspended chords, muted bass and speech-pause glints.
All synthesis uses Python's standard library.
"""
import math, wave, json
from array import array
from pathlib import Path

SR=22050
DURATION=76.233333
FRAMES=round(DURATION*SR)
OUT=Path("remotion-project/public/wordbase/wordbase-original-bed.wav")
MAP=Path("remotion-project/out/Wordbase-V3-pause-map.json")
music=array("f",[0.0])*FRAMES
TAU=2*math.pi
def freq(n): return 440.0 * (2**((n-69)/12))
def add_voice(midi,t,length,amp,kind="pad"):
    first=int(t*SR)
    n=min(int(length*SR),FRAMES-first)
    if n<=0: return
    hz=freq(midi)
    for i in range(n):
        x=i/SR
        if kind=="pad":
            # Soft slow attack and diffuse end, with minor detuning.
            a=(1-math.exp(-x*8.5))
            rel=min(1.0, max(0.0,(length-x)/.63))
            env=a*rel*rel
            val=(math.sin(TAU*hz*x)+0.21*math.sin(TAU*hz*1.004*x)+0.11*math.sin(TAU*hz*2*x))*env*amp
        elif kind=="keys":
            env=(1-math.exp(-x*110))*math.exp(-x*2.5)*(1-min(1.0,max(0,(x-length+.11)/.11)))
            val=(math.sin(TAU*hz*x)+.23*math.sin(TAU*hz*2*x)+.11*math.sin(TAU*hz*3.01*x))*env*amp
        elif kind=="bass":
            env=(1-math.exp(-x*48))*math.exp(-x*.8)
            val=(math.sin(TAU*hz*x)+.19*math.sin(TAU*hz*2*x))*env*amp
        else: # gentle bell/glint
            env=(1-math.exp(-x*135))*math.exp(-x*3)
            val=(math.sin(TAU*hz*x)+.31*math.sin(TAU*hz*2.006*x))*env*amp
        music[first+i]+=val

BPM=88
BAR=60/BPM*4
# Cmaj9 - Am9 - Fmaj9 - G6sus2: warm and quietly optimistic.
progression=[
  ([48,55,59,62],[60,64,67,71,74]),
  ([45,52,55,60],[57,60,64,67,71]),
  ([41,48,52,55],[57,60,64,67,69]),
  ([43,50,52,59],[59,62,67,69,74]),
]
for bar in range(math.ceil(DURATION/BAR)):
    start=bar*BAR
    notes,motif=progression[bar%4]
    if start>=DURATION: break
    # The pad has space; no sharp percussion under dialogue.
    for m in notes[1:]:
        add_voice(m,start,min(BAR+.48,DURATION-start),.030,"pad")
    add_voice(notes[0]-12,start,min(BAR,DURATION-start),.036,"bass")
    # Light keys: a repeating melody, not a ticking metronome.
    k=bar%4
    if k==0: phrase=[(0.0,2),(2.05,3)]
    elif k==1: phrase=[(.68,2),(2.05,1)]
    elif k==2: phrase=[(.0,3),(1.36,2)]
    else: phrase=[(.68,1),(2.04,2)]
    for offset,idx in phrase:
        if start+offset<DURATION:
            add_voice(motif[idx],start+offset,1.15,.054,"keys")
# Small bell flourishes at selected main reveals/pauses, not every silence.
if MAP.exists():
    events=json.loads(MAP.read_text())['events']
    for i,e in enumerate(x for x in events if x['major']):
        moment=e['paced_start_seconds']+.15
        add_voice([79,76,74,72][i%4],moment,.80,.029,"bell")
# Soft space/reverb, using delayed taps (mono, intentionally subtle).
for delay,feedback in ((.23,.12),(.46,.07)):
    offset=round(delay*SR)
    for i in range(offset,FRAMES):
        music[i]+=music[i-offset]*feedback
peak=max(abs(x) for x in music)
scale=min(1.0,.55/max(peak,.001))
with wave.open(str(OUT),"wb") as out:
    out.setnchannels(1)
    out.setsampwidth(2)
    out.setframerate(SR)
    BLOCK=16384
    for st in range(0,FRAMES,BLOCK):
        chunk=music[st:st+BLOCK]
        ints=array("h",(int(max(-.999,min(.999,x*scale))*32767) for x in chunk))
        if ints.itemsize != 2: raise RuntimeError("Expected 16bit int")
        out.writeframesraw(ints.tobytes())
print(json.dumps({"output":str(OUT),"duration_seconds":FRAMES/SR,"peak_before_master":peak,"notes":"Original composed soundtrack, no borrowed music"}))
