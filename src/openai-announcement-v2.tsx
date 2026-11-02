import React from 'react';
import wordTimestamps from '../public/openai-announcement/Transcript.word-timestamps.json';
import {Brain, Blocks, PenLine} from 'lucide-react';
import {SharedBucket} from './shared-bucket';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';

const FPS = 30;
const TOTAL = 4247;
const A = (name: string) => staticFile('openai-announcement/' + name);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = (f: number, start: number, length = 16) =>
  interpolate(f, [start, start + length], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const fade = (f: number, start: number, length = 16) => ease(f, start, length);
const rise = (f: number, start: number, length = 16, y = 38): React.CSSProperties => ({
  opacity: fade(f, start, length),
  transform: 'translate3d(0,' + ((1 - fade(f, start, length)) * y) + 'px,0)',
});
const scaleIn = (f: number, start: number, length = 20, from = 0.92): React.CSSProperties => ({
  opacity: fade(f, start, length),
  transform: 'scale(' + (from + (1 - from) * fade(f, start, length)) + ')',
});
const OUT = '#f3f4f6';
const MUTED = '#9ca3af';
const BLUE = '#8bbcff';
const CYAN = '#58d8e8';
const AMBER = '#ffb36b';
const RED = '#ff6d65';
const BG = '#080b12';
const FONT = 'Inter, ui-sans-serif, system-ui, Arial, sans-serif';

const ImgBg: React.FC<{name: string; f: number; dark?: number; position?: string; zoom?: number}> = ({
  name, f, dark = 0.54, position = 'center', zoom = 1.08,
}) => (
  <AbsoluteFill>
    <Img src={A(name)} style={{
      width: '100%', height: '100%', objectFit: 'cover', objectPosition: position,
      transform: 'scale(' + (zoom + 0.035 * fade(f, 0, 180)) + ') translate3d(' + (-10 + 20 * fade(f, 0, 240)) + 'px,0,0)',
      filter: 'saturate(.78) contrast(1.08)',
    }} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,8,14,' + (dark + 0.08) + ') 0%, rgba(5,8,14,' + dark + ') 42%, rgba(5,8,14,.91) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 28%, rgba(62,133,214,.18), transparent 52%)'}} />
  </AbsoluteFill>
);

const SceneShell: React.FC<{f: number; duration: number; children: React.ReactNode; label: string; number: string; warm?: boolean}> = ({
  f, duration, children, label, number, warm = false,
}) => {
  const inAlpha = fade(f, 0, 14);
  const outAlpha = interpolate(f, [Math.max(0, duration - 16), duration], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: BG, color: OUT, fontFamily: FONT, opacity: Math.min(inAlpha, outAlpha), overflow: 'hidden'}}>
      <AbsoluteFill style={{pointerEvents: 'none', opacity: .22, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '72px 72px'}} />
      <AbsoluteFill style={{pointerEvents: 'none', background: warm ? 'radial-gradient(ellipse at 50% 85%, rgba(255,155,91,.12), transparent 55%)' : 'radial-gradient(ellipse at 50% 90%, rgba(56,126,210,.12), transparent 58%)'}} />
      <div style={{position: 'absolute', top: 44, left: 58, display: 'flex', alignItems: 'center', gap: 12, zIndex: 50, opacity: .86}}>
        <div style={{width: 8, height: 8, borderRadius: 10, background: warm ? AMBER : CYAN, boxShadow: '0 0 18px ' + (warm ? AMBER : CYAN)}} />
        <div style={{fontSize: 15, fontWeight: 800, letterSpacing: 3, color: '#c6d0dd'}}>{label.toUpperCase()}</div>
      </div>
      <div style={{position: 'absolute', top: 42, right: 58, zIndex: 50, color: '#697587', fontSize: 14, fontWeight: 750, letterSpacing: 2}}>{number} / 15</div>
      {children}
      <div style={{position: 'absolute', bottom: 34, left: 58, right: 58, height: 2, background: 'rgba(255,255,255,.12)', zIndex: 50}}>
        <div style={{height: 2, width: (100 * Math.min(1, f / Math.max(1, duration))) + '%', background: warm ? AMBER : CYAN}} />
      </div>
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = CYAN}) => (
  <div style={{fontSize: 17, fontWeight: 850, letterSpacing: 4, color, textTransform: 'uppercase'}}>{children}</div>
);
const Headline: React.FC<{children: React.ReactNode; size?: number; color?: string; align?: 'left' | 'center'; style?: React.CSSProperties}> = ({
  children, size = 76, color = OUT, align = 'left', style = {},
}) => (
  <div style={{fontSize: size, lineHeight: .99, fontWeight: 850, letterSpacing: -3.2, color, textAlign: align, textWrap: 'balance', ...style}}>{children}</div>
);
const Subline: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({
  children, size = 27, color = '#bdc7d4', style = {},
}) => <div style={{fontSize: size, lineHeight: 1.35, fontWeight: 500, color, ...style}}>{children}</div>;
const Chip: React.FC<{children: React.ReactNode; color?: string; bg?: string; style?: React.CSSProperties}> = ({
  children, color = '#d8e8fa', bg = 'rgba(84,137,202,.14)', style = {},
}) => <div style={{display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(154,190,228,.28)', borderRadius: 999, padding: '12px 18px', color, background: bg, fontSize: 17, fontWeight: 750, letterSpacing: .3, ...style}}>{children}</div>;
const ImageCard: React.FC<{name: string; f: number; width: number; height: number; contain?: boolean; style?: React.CSSProperties}> = ({
  name, f, width, height, contain = false, style = {},
}) => (
  <div style={{width, height, overflow: 'hidden', borderRadius: 22, border: '1px solid rgba(190,210,235,.2)', background: '#101722', boxShadow: '0 28px 80px rgba(0,0,0,.38)', ...style}}>
    <Img src={A(name)} style={{width: '100%', height: '100%', objectFit: contain ? 'contain' : 'cover', transform: 'scale(' + (1.025 + .025 * fade(f, 0, 180)) + ')'}} />
  </div>
);
const Logo: React.FC<{name: string; f: number; size?: number; background?: string}> = ({name, f, size = 104, background = '#f8fafc'}) => (
  <div style={{width: size, height: size, borderRadius: 24, background, display: 'grid', placeItems: 'center', padding: 14, boxShadow: '0 18px 42px rgba(0,0,0,.25)', ...scaleIn(f, 0, 18, .82)}}>
    <Img src={A(name)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
  </div>
);

const WordSubtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = frame / FPS;
  const activeWord = wordTimestamps.words.find(({start, end}) => seconds >= start && seconds < end);
  if (!activeWord) return null;
  return <div style={{
    position: 'absolute', left: 54, right: 54, bottom: 88, zIndex: 100,
    display: 'flex', justifyContent: 'center', pointerEvents: 'none',
  }}>
    <div style={{
      padding: '10px 24px 12px', borderRadius: 14,
      background: 'rgba(4, 8, 14, .82)', border: '1px solid rgba(255,255,255,.18)',
      boxShadow: '0 8px 28px rgba(0,0,0,.42)', color: '#fff',
      fontFamily: FONT, fontSize: 42, lineHeight: 1.05, fontWeight: 800,
      letterSpacing: -.6, textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,.55)',
    }}>{activeWord.word}</div>
  </div>;
};

const S1: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The promise" number="01">
    <ImgBg name="abundant-intelligence.png" f={f} dark={.35} position="center" zoom={1.04}/>
    <div style={{position: 'absolute', left: 72, right: 520, top: 255}}>
      <div style={rise(f, 0)}><Eyebrow>REMEMBER WHEN?</Eyebrow></div>
      <div style={{marginTop: 30, ...rise(f, 12, 18)}}>
        <Headline size={58}>WE USED AI TO</Headline>
        <Headline size={64} color={BLUE}>REPLACE THE</Headline>
        <Headline size={64}>HARD PARTS.</Headline>
      </div>
      <div style={{marginTop: 38, ...rise(f, 72, 14)}}>
        <Chip color={AMBER} bg="rgba(255,179,107,.12)">EVERY DIFFICULT TASK</Chip>
      </div>
    </div>
    <div style={{position: 'absolute', bottom: 145, left: 72, ...rise(f, 168, 14)}}>
      <Headline size={48} color={OUT}>Why did I put that in the past tense?</Headline>
    </div>
  </SceneShell>;
};

const S2: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const nodes = Array.from({length: 18}, (_, i) => {
    const angle = i * Math.PI * 2 / 18;
    const radius = 85 + (i % 3) * 75 + 125 * ease(f, 25, 70);
    return {x: 540 + Math.cos(angle) * radius, y: 760 + Math.sin(angle) * radius * .72};
  });
  return <SceneShell f={f} duration={duration} label="The illusion" number="02">
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, #183552 0%, #0b1628 46%, #080b12 100%)'}}/>
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" style={{position:'absolute', inset:0, opacity: .68}}>
      {nodes.map((n,i)=><g key={i}>
        <line x1="540" y1="760" x2={n.x} y2={n.y} stroke={i%3===0?AMBER:CYAN} strokeWidth="2" opacity={.48*fade(f, 15+i*2, 20)}/>
        <circle cx={n.x} cy={n.y} r={i%4===0?10:6} fill={i%3===0?AMBER:CYAN} opacity={fade(f,20+i*2,18)}/>
      </g>)}
    </svg>
    <svg viewBox="0 0 220 180" style={{position:'absolute',left:430,top:670,width:220,height:180,...scaleIn(f,20,24,.82),filter:'drop-shadow(0 0 24px rgba(88,216,232,.55))'}}>
      <path d="M110 25 C96 10 73 15 65 34 C44 27 27 44 32 64 C13 76 20 103 39 111 C32 132 51 150 73 145 C81 163 100 163 110 151 C120 163 139 163 147 145 C169 150 188 132 181 111 C200 103 207 76 188 64 C193 44 176 27 155 34 C147 15 124 10 110 25Z" fill="rgba(13,34,59,.96)" stroke={CYAN} strokeWidth="4" strokeLinejoin="round"/>
      <path d="M110 27 C104 44 115 53 109 68 C103 82 116 91 110 106 C104 120 115 134 110 151 M94 37 C78 36 69 49 78 61 C85 70 81 79 69 84 M126 37 C142 36 151 49 142 61 C135 70 139 79 151 84 M69 91 C83 90 91 99 86 111 C82 122 91 132 102 135 M151 91 C137 90 129 99 134 111 C138 122 129 132 118 135" fill="none" stroke="#9cecf5" strokeWidth="3" strokeLinecap="round" opacity=".9"/>
      <circle cx="55" cy="78" r="4" fill={AMBER}/><circle cx="165" cy="78" r="4" fill={AMBER}/>
    </svg>
    <div style={{position:'absolute',left:65,right:65,top:205,textAlign:'center'}}>
      <div style={rise(f, 12, 18)}><Eyebrow color={AMBER}>THE ILLUSION OF</Eyebrow></div>
      <div style={{marginTop:28,...scaleIn(f,24,22,.83)}}>
        <Headline size={94} align="center">ABUNDANT</Headline>
        <Headline size={91} align="center" color={BLUE}>INTELLIGENCE.</Headline>
      </div>
    </div>
    <div style={{position:'absolute',left:80,right:80,bottom:165,textAlign:'center',...rise(f,80,18)}}>
      <Subline size={31} color={OUT}>Intelligence that could do practically everything for us.</Subline>
      <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:28}}>
        <Chip><span style={{display:'inline-flex',alignItems:'center',gap:10}}><PenLine size={20} color={CYAN}/><span>WRITE</span></span></Chip>
        <Chip><span style={{display:'inline-flex',alignItems:'center',gap:10}}><Brain size={20} color={BLUE}/><span>REASON</span></span></Chip>
        <Chip><span style={{display:'inline-flex',alignItems:'center',gap:10}}><Blocks size={20} color={AMBER}/><span>BUILD</span></span></Chip>
      </div>
    </div>
  </SceneShell>;
};

const S3: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The announcement" number="03">
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 25%, #263d5b 0%, #101722 44%, #080b12 100%)'}}/>
    <div style={{position: 'absolute', top: 145, left: 70, right: 70, textAlign: 'center', ...rise(f, 0, 16)}}>
      <Eyebrow color={AMBER}>OPENAI ANNOUNCEMENT</Eyebrow>
      <div style={{marginTop: 20}}><Headline size={66} align="center">A SHARED USAGE</Headline><Headline size={66} align="center" color={BLUE}>ALLOWANCE.</Headline></div>
    </div>
    <div style={{position: 'absolute', top: 340, left: 172, width: 736, height: 880, borderRadius: 22, background: '#f8fafc', overflow: 'hidden', boxShadow: '0 35px 100px rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.5)', ...scaleIn(f, 24, 22, .88)}}>
      <Img src={A('openai-announcement-email.png')} style={{width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top center'}}/>
    </div>
    <div style={{position: 'absolute', top: 1120, left: 70, right: 70, textAlign: 'center', ...rise(f, 100, 14)}}>
      <Chip color={CYAN}>THE EMAIL THAT CHANGES THE CONVERSATION</Chip>
    </div>
  </SceneShell>;
};

const S4: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const pulse = 1 + .035 * Math.sin(f / 8);
  return <SceneShell f={f} duration={duration} label="One allowance, two products" number="04">
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, rgba(53,112,173,.25), transparent 62%)'}}/>
    <div style={{position: 'absolute', top: 150, left: 68, right: 68, textAlign: 'center', ...rise(f, 0)}}>
      <Eyebrow>THE SHARED POOL</Eyebrow>
      <div style={{marginTop: 20}}><Headline size={72} align="center">TWO PRODUCTS.</Headline><Headline size={82} color={BLUE} align="center">ONE ALLOWANCE.</Headline></div>
    </div>
    <div style={{position: 'absolute', left: 80, top: 470, display: 'flex', alignItems: 'center', gap: 22, ...rise(f, 24, 20)}}>
      <Logo name="openai-logo.png" f={f} size={112}/>
      <div><div style={{fontSize: 32, fontWeight: 850}}>ChatGPT</div><div style={{fontSize: 18, color: MUTED}}>Advanced reasoning</div></div>
    </div>
    <div style={{position: 'absolute', left: 80, top: 675, display: 'flex', alignItems: 'center', gap: 22, ...rise(f, 140, 20)}}>
      <Logo name="codex-logo.png" f={f} size={112}/>
      <div><div style={{fontSize: 32, fontWeight: 850}}>Codex</div><div style={{fontSize: 18, color: MUTED}}>Coding sessions</div></div>
    </div>
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <path d="M 440 525 C 575 525, 565 700, 700 700" fill="none" stroke={CYAN} strokeWidth="4" strokeDasharray="9 12" strokeDashoffset={-f * 1.5} opacity={fade(f, 200, 18)}/>
      <path d="M 440 730 C 575 730, 565 700, 700 700" fill="none" stroke={AMBER} strokeWidth="4" strokeDasharray="9 12" strokeDashoffset={-f * 1.5} opacity={fade(f, 230, 18)}/>
    </svg>
    <div style={{position:'absolute', top:520, right:54, width:325, height:350, ...scaleIn(f,200,25,.85)}}><SharedBucket/></div>
    <div style={{position: 'absolute', bottom: 145, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, ...rise(f,0,14)}}><Logo name="claude-logo.png" f={f} size={62}/><span style={{fontSize: 19, color: '#d8dce3'}}>Just like Claude: one shared allowance bucket</span></div>
      <div style={rise(f,200,14)}><Chip color={AMBER} bg="rgba(255,179,107,.1)">SHARED USAGE</Chip></div>
    </div>
  </SceneShell>;
};

const S5: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const remaining = interpolate(f, [14, 135], [100, 28], clamp);
  return <SceneShell f={f} duration={duration} label="Advanced reasoning" number="05">
    <div style={{position: 'absolute', top: 165, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>THE TRADE-OFF</Eyebrow>
      <div style={{marginTop: 22, ...rise(f, 8)}}><Headline size={72}>HIGHER REASONING.</Headline><Headline size={72} color={BLUE}>SAME RESERVE.</Headline></div>
    </div>
    <div style={{position: 'absolute', top: 390, left: 70, width: 500, height: 660, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,.18)', boxShadow: '0 30px 80px rgba(0,0,0,.4)', ...scaleIn(f, 0, 10, .94)}}>
      <Img src={A('high-extra-high-mode.png')} style={{width: '100%', height: '100%', objectFit: 'contain', background: '#f8fafc'}}/>
    </div>
    <div style={{position: 'absolute', left: 625, right: 72, top: 505}}>
      <div style={rise(f, 55)}><Eyebrow>USAGE REMAINING</Eyebrow></div>
      <div style={{marginTop: 20, fontSize: 24, fontWeight: 800, letterSpacing: 2, color: '#d5e1ee', ...rise(f, 70)}}>SHARED RESERVE</div>
      <div style={{height: 18, borderRadius: 99, background: 'rgba(255,255,255,.12)', overflow: 'hidden', marginTop: 22}}>
        <div style={{width: remaining + '%', height: '100%', background: 'linear-gradient(90deg,' + CYAN + ',' + AMBER + ')', borderRadius: 99}}/>
      </div>
      <div style={{marginTop: 12, fontSize: 14, color: MUTED, letterSpacing: 1}}>ILLUSTRATIVE USAGE METER</div>
      <div style={{marginTop: 42, ...rise(f, 110, 16)}}><Headline size={42}>THINK BEFORE</Headline><Headline size={42} color={AMBER}>YOU SPEND.</Headline></div>
      <Subline style={{marginTop: 24}} size={22}>A complex reasoning task can draw from the same allowance you use for coding.</Subline>
    </div>
    <div style={{position: 'absolute', bottom: 130, left: 72, ...rise(f, 65, 14)}}><Chip color={AMBER}>HIGH / EXTRA HIGH</Chip></div>
  </SceneShell>;
};

const S6: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The illusion" number="06">
    <ImgBg name="abundant-intelligence.png" f={f} dark={.5} zoom={1.12}/>
    <div style={{position: 'absolute', top: 260, left: 72, right: 72}}>
      {f < 150 ? <><Eyebrow color={AMBER}>BUT HERE'S THE QUESTION</Eyebrow><div style={{marginTop: 32, ...rise(f, 0, 12)}}><Headline size={76}>HERE'S WHAT</Headline><Headline size={87} color={BLUE}>I FIND INTERESTING.</Headline></div></> : <><Eyebrow color={AMBER}>FOR YEARS, WE BELIEVED...</Eyebrow><div style={{marginTop: 32, ...rise(f, 150, 15)}}><Headline size={92}>AI INTELLIGENCE</Headline><Headline size={100} color={BLUE}>WAS CHEAP.</Headline></div></>}
      <div style={{marginTop: 54, ...rise(f, 130, 16)}}><Headline size={48} color={AMBER}>BUT THAT WAS AN ILLUSION.</Headline></div>
      <div style={{marginTop: 30, width: 690, height: 3, background: 'rgba(255,255,255,.2)', overflow: 'hidden'}}><div style={{height: 3, width: (fade(f, 135, 45) * 100) + '%', background: AMBER}}/></div>
    </div>
    <div style={{position: 'absolute', top: 650, left: 72, right: 72, height: 526, overflow: 'hidden', borderRadius: 22, border: '1px solid rgba(190,210,235,.28)', boxShadow: '0 28px 80px rgba(0,0,0,.55)', opacity: fade(f, 30, 18) * (1 - fade(f, 120, 8)), transform: 'translate3d(0,' + ((1 - fade(f, 30, 18)) * 24) + 'px,0)'}}>
      <Img src={A('Skeptical people.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    </div>
    <div style={{position: 'absolute', top: 615, left: 140, right: 140, height: 650, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: fade(f, 120, 8) * (1 - fade(f, 210, 8)), transform: 'translate3d(0,' + ((1 - fade(f, 120, 8)) * 24) + 'px,0)', filter: 'drop-shadow(0 24px 42px rgba(0,0,0,.55))'}}>
      <Img src={A('blindfolded-cutout.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
    </div>
    <div style={{position: 'absolute', top: 615, left: 215, width: 650, height: 650, overflow: 'hidden', borderRadius: 22, border: '1px solid rgba(255,255,255,.65)', boxShadow: '0 28px 80px rgba(0,0,0,.55)', background: '#f7f6f1', opacity: fade(f, 210, 8), transform: 'translate3d(0,' + ((1 - fade(f, 210, 8)) * 24) + 'px,0)'}}>
      <Img src={A('cost-of-intelligence.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    </div>
  </SceneShell>;
};

const S7: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const tokens = Math.round(interpolate(f, [0, 250], [128, 24800], clamp));
  const compute = interpolate(f, [180, 270], [8, 100], clamp);
  const money = fade(f, 240, 12) * (1 - fade(f, 278, 12));
  const steps = ['REASONING STEP', 'TOOL CALL', 'AUTONOMOUS AGENT'];
  const stepStarts = [0, 40, 73];
  return <SceneShell f={f} duration={duration} label="The cost of intelligence" number="07">
    <ImgBg name="gpu-closeup.png" f={f} dark={.48} position="center" zoom={1.12}/>
    <div style={{position: 'absolute', top: 160, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>COMPUTE IS NOT FREE</Eyebrow>
      <div style={{marginTop: 25, ...rise(f, 10)}}><Headline size={76}>EVERY REASONING</Headline><Headline size={76} color={BLUE}>STEP COSTS.</Headline></div>
    </div>
    <div style={{position: 'absolute', left: 72, right: 72, top: 505, display: 'flex', gap: 16}}>
      {steps.map((x, i) => {
        const active = f >= stepStarts[i];
        return <div key={x} style={{flex: 1, border: '1px solid ' + (active ? 'rgba(88,216,232,.62)' : 'rgba(180,210,240,.25)'), background: active ? 'rgba(13,30,46,.92)' : 'rgba(8,13,22,.78)', borderRadius: 16, padding: '23px 15px', minHeight: 120, boxShadow: active ? '0 0 28px rgba(88,216,232,.16)' : 'none', ...rise(f, stepStarts[i], 16)}}>
          <div style={{fontSize: 14, letterSpacing: 2, color: i === 2 ? AMBER : CYAN, fontWeight: 850}}>{'0' + (i + 1)}</div>
          <div style={{fontSize: 21, fontWeight: 850, marginTop: 16}}>{x}</div>
        </div>;
      })}
    </div>
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
      {[225,540,855].map((x,i)=><path key={x} d={i===0?'M 225 675 Q 225 710 540 748':i===1?'M 540 675 L 540 748':'M 855 675 Q 855 710 540 748'} fill="none" stroke={i===2?AMBER:CYAN} strokeWidth="3" strokeDasharray="10 13" strokeDashoffset={-f*2.2} opacity={fade(f,[28,58,88][i],16)}/>) }
      <circle cx="540" cy="748" r={6+4*(.5+.5*Math.sin(f/8))} fill={CYAN} opacity={fade(f,90,16)} />
    </svg>
    <div style={{position:'absolute',left:72,top:785,width:560,...rise(f,95,16)}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:15,letterSpacing:2,fontWeight:850,color:'#d5e1ee'}}><span>COMPUTE USED</span><span style={{color:AMBER}}>RISING</span></div>
      <div style={{height:18,borderRadius:99,background:'rgba(255,255,255,.13)',overflow:'hidden',marginTop:16,boxShadow:'0 0 24px rgba(88,216,232,.12)'}}>
        <div style={{width:compute+'%',height:'100%',borderRadius:99,background:'linear-gradient(90deg,'+CYAN+','+BLUE+','+AMBER+')'}}/>
      </div>
      <div style={{fontSize:14,color:MUTED,letterSpacing:1,marginTop:12}}>REASONING + TOOLS + AGENTS</div>
    </div>
    <div style={{position:'absolute',right:72,top:770,width:330,height:235,borderRadius:18,overflow:'hidden',border:'1px solid rgba(255,255,255,.3)',boxShadow:'0 24px 60px rgba(0,0,0,.48)',opacity:money,transform:'translate3d(0,'+((1-money)*20)+'px,0)'}}>
      <Img src={A('rupees-2000.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'12px 14px',background:'linear-gradient(transparent,rgba(8,11,18,.92))',fontSize:15,fontWeight:850,letterSpacing:2,color:AMBER}}>COMPUTE COSTS MONEY</div>
    </div>
    <div style={{position: 'absolute', bottom: 175, left: 72, right: 72, display: 'flex', alignItems: 'end', justifyContent: 'space-between'}}>
      <div style={rise(f, 95, 15)}><div style={{fontSize: 15, color: MUTED, letterSpacing: 2, fontWeight: 800}}>SIMULATED TOKEN ACTIVITY</div><div style={{fontSize: 55, fontWeight: 900, color: AMBER, fontVariantNumeric: 'tabular-nums', marginTop: 8}}>{tokens.toLocaleString('en-US')}</div></div>
      <div style={{fontSize: 18, color: '#d1d8e2', textAlign: 'right', ...rise(f, 125, 15)}}>A 20-minute agent<br/>still consumes compute.</div>
    </div>
  </SceneShell>;
};

const S8: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="Who pays?" number="08">
    <ImgBg name="server-infrastructure.png" f={f} dark={.42} zoom={1.1}/>
    <div style={{position: 'absolute', left: 72, top: 220, right: 72}}>
      <Eyebrow color={AMBER}>THE COST WAS ALWAYS THERE</Eyebrow>
      <div style={{marginTop: 28, ...rise(f, 12)}}><Headline size={82}>SOMEONE WAS</Headline><Headline size={82} color={BLUE}>ABSORBING IT.</Headline></div>
      <div style={{marginTop: 46, ...rise(f, 85, 18)}}>
        <Subline size={27}>Companies competed to make AI more capable and accessible while carrying enormous compute bills.</Subline>
      </div>
      <div style={{marginTop: 28, ...rise(f, 220, 16)}}>
        <Subline size={25} color={AMBER}>Eventually, those costs have to be accounted for somewhere.</Subline>
      </div>
    </div>
    <div style={{position: 'absolute', bottom: 170, left: 72, right: 72, display: 'flex', gap: 12, ...rise(f, 145, 16)}}>
      <Chip>TRAINING</Chip><Chip>INFERENCE</Chip><Chip color={AMBER} bg="rgba(255,179,107,.12)">SERVING</Chip>
    </div>
  </SceneShell>;
};

const S9: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The bubble" number="09">
    <ImgBg name="ai-bubble-burst.png" f={f} dark={.32} zoom={1.04}/>
    <div style={{position: 'absolute', top: 210, left: 70, right: 70, textAlign: 'center'}}>
      <Eyebrow color={AMBER}>THE QUESTION ISN'T WHETHER AI WORKS</Eyebrow>
      <div style={{marginTop: 36, ...rise(f, 14, 20)}}><Headline size={105} align="center">THE AI</Headline><Headline size={116} color={RED} align="center">BUBBLE?</Headline></div>
      <div style={{marginTop: 50, ...rise(f, 118, 18)}}><Subline size={29} color={OUT}>Maybe the economics are finally catching up with the promises.</Subline></div>
    </div>
    <div style={{position: 'absolute', bottom: 160, left: 72, right: 72, textAlign: 'center', ...rise(f, 185, 14)}}><Chip color={AMBER} bg="rgba(255,179,107,.12)">NOT A TECHNOLOGY COLLAPSE. AN ECONOMIC REALITY CHECK.</Chip></div>
  </SceneShell>;
};

const S10: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The uncomfortable question" number="10">
    <div style={{position: 'absolute', top: 170, left: 72, right: 72}}>
      <div style={rise(f, 0)}><Eyebrow color={CYAN}>OPENAI SAYS</Eyebrow></div>
      <div style={{marginTop: 22, ...rise(f, 12)}}><Headline size={74}>INSTANT USAGE</Headline><Headline size={84} color={BLUE}>REMAINS</Headline><Headline size={104} color={AMBER}>UNLIMITED.</Headline></div>
    </div>
    <div style={{position: 'absolute', left: 72, right: 72, bottom: 185, textAlign: 'center'}}>
      <div style={{fontSize: 18, color: MUTED, fontWeight: 800, letterSpacing: 4, ...rise(f, 90)}}>AND MY QUESTION IS...</div>
      <div style={{marginTop: 20, ...scaleIn(f, 115, 22, .76)}}><Headline size={130} align="center" color={RED}>FOR HOW LONG?</Headline></div>
      <div style={{marginTop: 28, ...rise(f, 168, 15)}}><Headline size={44} align="center">THINK ABOUT IT.</Headline></div>
    </div>
    <div style={{position: 'absolute', right: 0, top: 0, width: 5, height: 1350, background: 'linear-gradient(180deg,transparent,' + RED + ',transparent)', opacity: .7}}/>
  </SceneShell>;
};

const S11: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="Think about it" number="11">
    <ImgBg name="usage-allowance.png" f={f} dark={.52} position="center" zoom={1.08}/>
    <div style={{position: 'absolute', top: 215, left: 72, right: 72, textAlign: 'center'}}>
      <Eyebrow color={CYAN}>INSTANT USAGE MAY BE UNLIMITED</Eyebrow>
      <div style={{marginTop: 40, ...rise(f, 12)}}><Headline size={108} align="center">BUT FOR</Headline><Headline size={132} color={RED} align="center">HOW LONG?</Headline></div>
      <div style={{marginTop: 65, ...rise(f, 120, 18)}}><Subline size={25} color={OUT}>How long can the promise of abundant, cheap intelligence really last?</Subline></div>
    </div>
  </SceneShell>;
};

const S12: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The silver lining" number="12" warm>
    <ImgBg name="human-coding.png" f={f} dark={.48} position="center" zoom={1.08}/>
    <div style={{position: 'absolute', top: 170, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>MAYBE LIMITS AREN'T ENTIRELY BAD</Eyebrow>
      <div style={{marginTop: 28, ...rise(f, 100)}}><Headline size={82}>GET INVOLVED</Headline><Headline size={92} color={AMBER}>AGAIN.</Headline></div>
      <div style={{marginTop: 38, display: 'flex', gap: 12, ...rise(f, 210, 16)}}>
        <Chip color={AMBER} bg="rgba(255,179,107,.13)">READ</Chip><Chip color={AMBER} bg="rgba(255,179,107,.13)">UNDERSTAND</Chip><Chip color={AMBER} bg="rgba(255,179,107,.13)">DEBUG</Chip>
      </div>
      <div style={{marginTop: 48, ...rise(f, 370, 16)}}><Headline size={59}>USE THAT IQ.</Headline><Subline size={24} color={OUT} style={{marginTop: 12}}>The one that's been sitting lonely in a corner.</Subline></div>
      <div style={{marginTop: 45, ...rise(f, 475, 16)}}><Headline size={50} color={AMBER}>THAT DOPAMINE BUZZ.</Headline></div>
      <div style={{marginTop: 12, ...rise(f, 624, 16)}}><Headline size={58}>THAT FLOW STATE.</Headline></div>
    </div>
    <div style={{position: 'absolute', right: 60, bottom: 150, width: 250, height: 145, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,179,107,.35)', opacity: fade(f, 624, 18)}}><Img
      src={A('flow-state-abstract.png')}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        scale: 1.54
      }}
    /></div>
  </SceneShell>;
};

const S13: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The trade-off" number="13" warm>
    <ImgBg name="productivity-aesthetic.png" f={f} dark={.48} zoom={1.08}/>
    <div style={{position: 'absolute', top: 245, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>THE WORK MIGHT TAKE LONGER</Eyebrow>
      <div style={{marginTop: 34, ...rise(f, 12)}}><Headline size={85}>SLOWER</Headline><Headline size={98} color={AMBER}>WORKFLOWS.</Headline></div>
      <div style={{marginTop: 65, ...rise(f, 105, 16)}}><div style={{fontSize: 28, fontWeight: 750, color: '#aeb7c4', textDecoration: 'line-through', textDecorationColor: RED, textDecorationThickness: 3}}>&quot;AI CAN DO IT FOR CHEAPER.&quot;</div></div>
      <div style={{marginTop: 35, ...rise(f, 165, 16)}}><Headline size={52}>MAYBE THAT'S</Headline><Headline size={61} color={AMBER}>NOT A BAD THING.</Headline></div>
    </div>
  </SceneShell>;
};

const S14: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="Expertise and ownership" number="14" warm>
    <ImgBg name="productivity-aesthetic.png" f={f} dark={.5} zoom={1.08}/>
    <div style={{position: 'absolute', top: 205, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>WHAT WE MIGHT GET BACK</Eyebrow>
      <div style={{marginTop: 35}}><div style={rise(f,4,14)}><Headline size={82}>EXPERTISE.</Headline></div><div style={rise(f,66,14)}><Headline size={82} color={AMBER}>UNDERSTANDING.</Headline></div><div style={rise(f,137,14)}><Headline size={82}>OWNERSHIP.</Headline></div></div>
      <div style={{marginTop: 55, ...rise(f, 120, 16)}}><Subline size={27} color={OUT}>Not just faster output. Knowing what you built, and why.</Subline></div>
    </div>
  </SceneShell>;
};

const S15: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="Signing off" number="15" warm>
    <ImgBg name="human-coding.png" f={f} dark={.55} zoom={1.12}/>
    <div style={{position: 'absolute', top: 255, left: 70, right: 70, textAlign: 'center'}}>
      <div style={{...rise(f, 0, 12)}}><Headline size={66} align="center">AI SHOULD MAKE US</Headline></div>
      <div style={{marginTop: 24, ...rise(f, 20, 16)}}><Headline size={90} align="center" color={AMBER}>MORE CAPABLE.</Headline></div>
      <div style={{marginTop: 40, ...rise(f, 82, 16)}}><Headline size={60} align="center">NOT INCAPABLE</Headline><Headline size={60} align="center">WITHOUT IT.</Headline></div>
      <div style={{marginTop: 100, ...rise(f, 145, 18)}}>
        <div style={{fontSize: 17, color: '#d1d9e3', fontWeight: 800, letterSpacing: 4}}>SIGNING OFF</div>
        <div style={{fontSize: 40, color: OUT, fontWeight: 850, marginTop: 14}}>ABHIJEET SINGH</div>
      </div>
    </div>
  </SceneShell>;
};

const STARTS = [0, 240, 510, 810, 1050, 1200, 1470, 1740, 2130, 2190, 2376, 2610, 3570, 3780, 4050];
// Silence windows measured from voiceover.mp3 at -33 dB with a 0.18 s minimum.
const SILENCE_GAPS: [number, number][] = [
  [104,14],[134,9],[195,14],[219,7],[323,12],[414,13],[446,12],[508,16],[531,9],[672,17],
  [800,9],[829,18],[924,8],[978,8],[1037,14],[1058,6],[1193,16],[1266,17],[1390,18],[1453,16],
  [1498,10],[1535,9],[1630,16],[1697,13],[1735,6],[1760,16],[1946,16],[1981,9],[2053,16],[2176,15],
  [2269,14],[2311,10],[2339,19],[2372,12],[2481,13],[2600,15],[2630,12],[2690,17],[2801,14],[2883,6],
  [2965,15],[2987,9],[3067,16],[3221,13],[3260,13],[3395,15],[3552,16],[3637,11],[3678,8],[3768,15],
  [3831,11],[3902,14],[3970,7],[4031,16],[4117,13],[4179,6],[4205,12],[4240,7],
];
const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15];
const LABELS = ['The promise','The price','The announcement','Shared allowance','Advanced reasoning','The illusion','Compute costs','Infrastructure','The bubble','For how long?','Silver lining','Human intelligence','Flow state','Ownership','Closing'];
const PauseTransition: React.FC<{duration: number; tone: string}> = ({duration, tone}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, Math.max(1, duration - 1)], [-1250, 1250], clamp);
  const opacity = interpolate(f, [0, Math.max(1, duration * .3), Math.max(1, duration * .7), duration], [0, .10, .10, 0], clamp);
  return <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: -120, bottom: -120, left: x, width: 180, transform: 'skewX(-18deg)', opacity, background: 'linear-gradient(90deg, transparent, ' + tone + ', rgba(255,255,255,.6), ' + tone + ', transparent)', boxShadow: '0 0 22px ' + tone}}/>
  </AbsoluteFill>;
};

export const OpenAIAnnouncementV2: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Audio src={A('voiceover.mp3')} volume={1}/>
    <WordSubtitle />
    {SCENES.map((Scene, i) => {
      const from = STARTS[i];
      const end = i === STARTS.length - 1 ? TOTAL : STARTS[i + 1] + 18;
      const duration = end - from;
      return <Sequence key={LABELS[i]} from={from} durationInFrames={duration} premountFor={15}>
        <Scene duration={duration}/>
      </Sequence>;
    })}
    {SILENCE_GAPS.map(([from, duration], i) => <Sequence key={'silence-transition-' + from} from={from} durationInFrames={duration}>
      <PauseTransition duration={duration} tone={i % 2 === 0 ? '#65c8ed' : '#f3a66b'}/>
    </Sequence>)}
    <Sequence from={0} durationInFrames={STARTS[1]}>
      <OpeningImage/>
    </Sequence>
    <Sequence
      from={450}
      durationInFrames={60}
      style={{
        translate: '-1px 0px'
      }}
    >
      <RupeesOverlay/>
    </Sequence>
    <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,.10), transparent 20%, transparent 80%, rgba(0,0,0,.18))'}}/>
  </AbsoluteFill>
);

const OpeningImage: React.FC = () => {
  const f = useCurrentFrame();
  const inAlpha = fade(f, 0, 14);
  const outAlpha = interpolate(f, [STARTS[1] - 18, STARTS[1]], [1, 0], clamp);
  return <AbsoluteFill style={{zIndex: 60, pointerEvents: 'none', opacity: Math.min(inAlpha, outAlpha)}}>
    <Img
      src={A('ai-utopia.png')}
      style={{
        position: 'absolute',
        top: 350,
        right: 76,
        width: 400,
        height: 400,
        objectFit: 'contain',
        borderRadius: 18,
        boxShadow: '0 22px 58px rgba(0,0,0,.42)',
        border: '1px solid rgba(255,255,255,.24)',
        translate: '-54.4px 296.3px'
      }}
    />
  </AbsoluteFill>;
};

const RupeesOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const inAlpha = fade(f, 0, 15);
  const outAlpha = interpolate(f, [45, 60], [1, 0], clamp);
  return <AbsoluteFill style={{background: 'rgba(8,11,18,.94)', justifyContent: 'center', alignItems: 'center', opacity: Math.min(inAlpha, outAlpha)}}>
    <Img src={A('rupees-2000.png')} style={{width: 830, height: 600, objectFit: 'contain'}}/>
    <div style={{fontFamily: FONT, fontSize: 68, fontWeight: 900, color: AMBER, marginTop: 36}}>₹2,000 / MONTH?</div>
  </AbsoluteFill>;
};
