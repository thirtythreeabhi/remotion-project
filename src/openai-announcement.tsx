import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
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

const S1: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The promise" number="01">
    <ImgBg name="abundant-intelligence.png" f={f} dark={.35} position="center" zoom={1.04}/>
    <div style={{position: 'absolute', left: 72, right: 70, top: 255}}>
      <div style={rise(f, 0)}><Eyebrow>REMEMBER WHEN?</Eyebrow></div>
      <div style={{marginTop: 30, ...rise(f, 12, 18)}}>
        <Headline size={91}>WE USED AI TO</Headline>
        <Headline size={100} color={BLUE}>REPLACE THE</Headline>
        <Headline size={100}>HARD PARTS.</Headline>
      </div>
      <div style={{marginTop: 52, ...rise(f, 118, 14)}}>
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
  return <SceneShell f={f} duration={duration} label="The price of the promise" number="02">
    <ImgBg name="abundant-intelligence.png" f={f} dark={.68} position="center" zoom={1.13}/>
    <div style={{position: 'absolute', left: 72, right: 72, top: 225}}>
      <div style={rise(f, 0)}><Eyebrow color={AMBER}>ABUNDANT INTELLIGENCE</Eyebrow></div>
      <div style={{marginTop: 28, ...rise(f, 12, 18)}}>
        <Headline size={80}>INTELLIGENCE</Headline>
        <Headline size={80} color={BLUE}>ON DEMAND.</Headline>
      </div>
      <div style={{marginTop: 45, ...scaleIn(f, 86, 24, .72)}}>
        <ImageCard name="rupees-2000.png" f={f} width={650} height={365} contain style={{margin: '0 auto', background: '#0e131d'}}/>
      </div>
      <div style={{marginTop: 25, textAlign: 'center', ...rise(f, 130, 14)}}>
        <Headline size={48} color={AMBER} align="center">₹2,000 / MONTH?</Headline>
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
    <div style={{position: 'absolute', left: 80, top: 675, display: 'flex', alignItems: 'center', gap: 22, ...rise(f, 44, 20)}}>
      <Logo name="codex-logo.png" f={f} size={112}/>
      <div><div style={{fontSize: 32, fontWeight: 850}}>Codex</div><div style={{fontSize: 18, color: MUTED}}>Coding sessions</div></div>
    </div>
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <path d="M 440 525 C 575 525, 565 700, 700 700" fill="none" stroke={CYAN} strokeWidth="4" strokeDasharray="9 12" strokeDashoffset={-f * 1.5} opacity={fade(f, 28, 18)}/>
      <path d="M 440 730 C 575 730, 565 700, 700 700" fill="none" stroke={AMBER} strokeWidth="4" strokeDasharray="9 12" strokeDashoffset={-f * 1.5} opacity={fade(f, 48, 18)}/>
    </svg>
    <div style={{position: 'absolute', top: 555, right: 72, width: 300, height: 300, borderRadius: '50%', border: '2px solid rgba(120,190,235,.55)', background: 'radial-gradient(circle, rgba(67,145,209,.28), rgba(11,19,31,.92) 68%)', boxShadow: '0 0 70px rgba(76,160,230,.22)', display: 'grid', placeItems: 'center', transform: 'scale(' + pulse + ')', ...scaleIn(f, 55, 25, .72)}}>
      <div style={{textAlign: 'center'}}><div style={{fontSize: 18, color: CYAN, fontWeight: 800, letterSpacing: 3}}>COMBINED</div><div style={{fontSize: 38, fontWeight: 900, marginTop: 10}}>USAGE</div><div style={{fontSize: 16, color: MUTED, marginTop: 8}}>one shared reserve</div></div>
    </div>
    <div style={{position: 'absolute', top: 900, right: 60, width: 410, height: 190, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(150,190,225,.24)', background: '#101722', boxShadow: '0 18px 50px rgba(0,0,0,.3)', ...scaleIn(f, 78, 18, .9)}}>
      <OffthreadVideo src={A('shared-allowance.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
    </div>
    <div style={{position: 'absolute', bottom: 145, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...rise(f, 105, 16)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Logo name="claude-logo.png" f={f} size={62}/><span style={{fontSize: 19, color: '#d8dce3'}}>A familiar model: Claude</span></div>
      <Chip color={AMBER} bg="rgba(255,179,107,.1)">SHARED USAGE</Chip>
    </div>
  </SceneShell>;
};

const S5: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const remaining = interpolate(f, [24, 250], [100, 28], clamp);
  return <SceneShell f={f} duration={duration} label="Advanced reasoning" number="05">
    <div style={{position: 'absolute', top: 165, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>THE TRADE-OFF</Eyebrow>
      <div style={{marginTop: 22, ...rise(f, 8)}}><Headline size={72}>HIGHER REASONING.</Headline><Headline size={72} color={BLUE}>SAME RESERVE.</Headline></div>
    </div>
    <div style={{position: 'absolute', top: 390, left: 70, width: 500, height: 660, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,.18)', boxShadow: '0 30px 80px rgba(0,0,0,.4)', ...scaleIn(f, 28, 22, .9)}}>
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
    <div style={{position: 'absolute', bottom: 130, left: 72, ...rise(f, 180, 14)}}><Chip color={AMBER}>HIGH / EXTRA HIGH</Chip></div>
  </SceneShell>;
};

const S6: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The illusion" number="06">
    <ImgBg name="abundant-intelligence.png" f={f} dark={.5} zoom={1.12}/>
    <div style={{position: 'absolute', top: 260, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>FOR YEARS, WE BELIEVED...</Eyebrow>
      <div style={{marginTop: 32, ...rise(f, 12, 18)}}><Headline size={92}>AI INTELLIGENCE</Headline><Headline size={100} color={BLUE}>WAS CHEAP.</Headline></div>
      <div style={{marginTop: 54, ...rise(f, 120, 16)}}><Headline size={48} color={AMBER}>BUT THAT WAS AN ILLUSION.</Headline></div>
      <div style={{marginTop: 30, width: 690, height: 3, background: 'rgba(255,255,255,.2)', overflow: 'hidden'}}><div style={{height: 3, width: (fade(f, 135, 45) * 100) + '%', background: AMBER}}/></div>
    </div>
  </SceneShell>;
};

const S7: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const tokens = Math.round(interpolate(f, [0, 250], [128, 24800], clamp));
  return <SceneShell f={f} duration={duration} label="The cost of intelligence" number="07">
    <ImgBg name="gpu-closeup.png" f={f} dark={.48} position="center" zoom={1.12}/>
    <div style={{position: 'absolute', top: 160, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>COMPUTE IS NOT FREE</Eyebrow>
      <div style={{marginTop: 25, ...rise(f, 10)}}><Headline size={76}>EVERY REASONING</Headline><Headline size={76} color={BLUE}>STEP COSTS.</Headline></div>
    </div>
    <div style={{position: 'absolute', left: 72, right: 72, top: 505, display: 'flex', gap: 16}}>
      {['REASONING STEP', 'TOOL CALL', 'AUTONOMOUS AGENT'].map((x, i) => <div key={x} style={{flex: 1, border: '1px solid rgba(180,210,240,.25)', background: 'rgba(8,13,22,.78)', borderRadius: 16, padding: '23px 15px', minHeight: 120, ...rise(f, 22 + i * 22, 16)}}><div style={{fontSize: 14, letterSpacing: 2, color: i === 2 ? AMBER : CYAN, fontWeight: 850}}>{'0' + (i + 1)}</div><div style={{fontSize: 21, fontWeight: 850, marginTop: 16}}>{x}</div></div>)}
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
      <div style={{marginTop: 28, ...rise(f, 180, 15)}}><Headline size={44} align="center">THINK ABOUT IT.</Headline></div>
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
      <div style={{marginTop: 65, ...rise(f, 135, 18)}}><Subline size={25} color={OUT}>How long can the promise of abundant, cheap intelligence really last?</Subline></div>
    </div>
  </SceneShell>;
};

const S12: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  return <SceneShell f={f} duration={duration} label="The silver lining" number="12" warm>
    <ImgBg name="human-coding.png" f={f} dark={.48} position="center" zoom={1.08}/>
    <div style={{position: 'absolute', top: 170, left: 72, right: 72}}>
      <Eyebrow color={AMBER}>MAYBE LIMITS AREN'T ENTIRELY BAD</Eyebrow>
      <div style={{marginTop: 28, ...rise(f, 10)}}><Headline size={82}>GET INVOLVED</Headline><Headline size={92} color={AMBER}>AGAIN.</Headline></div>
      <div style={{marginTop: 38, display: 'flex', gap: 12, ...rise(f, 58, 16)}}>
        <Chip color={AMBER} bg="rgba(255,179,107,.13)">READ</Chip><Chip color={AMBER} bg="rgba(255,179,107,.13)">UNDERSTAND</Chip><Chip color={AMBER} bg="rgba(255,179,107,.13)">DEBUG</Chip>
      </div>
      <div style={{marginTop: 48, ...rise(f, 112, 16)}}><Headline size={59}>USE THAT IQ.</Headline><Subline size={24} color={OUT} style={{marginTop: 12}}>The one that's been sitting lonely in a corner.</Subline></div>
      <div style={{marginTop: 45, ...rise(f, 235, 16)}}><Headline size={50} color={AMBER}>THAT DOPAMINE BUZZ.</Headline><Headline size={58}>THAT FLOW STATE.</Headline></div>
    </div>
    <div style={{position: 'absolute', right: 60, bottom: 150, width: 250, height: 145, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,179,107,.35)', opacity: fade(f, 200, 18)}}><Img src={A('flow-state-abstract.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/></div>
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
      <div style={{marginTop: 35, ...rise(f, 10)}}><Headline size={82}>EXPERTISE.</Headline><Headline size={82} color={AMBER}>UNDERSTANDING.</Headline><Headline size={82}>OWNERSHIP.</Headline></div>
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

const STARTS = [0, 240, 510, 780, 1140, 1410, 1680, 1980, 2250, 2535, 2880, 3120, 3570, 3840, 4050];
const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15];
const LABELS = ['The promise','The price','The announcement','Shared allowance','Advanced reasoning','The illusion','Compute costs','Infrastructure','The bubble','For how long?','Silver lining','Human intelligence','Flow state','Ownership','Closing'];
const Wipe: React.FC<{tone: string}> = ({tone}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 23], [-1250, 1250], clamp);
  const opacity = interpolate(f, [0, 4, 18, 23], [0, .88, .88, 0], clamp);
  return <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden', opacity}}>
    <div style={{position: 'absolute', top: -120, bottom: -120, left: x, width: 520, transform: 'skewX(-18deg)', background: 'linear-gradient(90deg, transparent, ' + tone + ', rgba(255,255,255,.85), ' + tone + ', transparent)', boxShadow: '0 0 80px ' + tone}}/>
  </AbsoluteFill>;
};

export const OpenAIAnnouncement: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Audio src={A('voiceover.mp3')} volume={1}/>
    {SCENES.map((Scene, i) => {
      const from = STARTS[i];
      const end = i === STARTS.length - 1 ? TOTAL : STARTS[i + 1] + 18;
      const duration = end - from;
      return <Sequence key={LABELS[i]} from={from} durationInFrames={duration} premountFor={15}>
        <Scene duration={duration}/>
      </Sequence>;
    })}
    {STARTS.slice(1).map((from, i) => <Sequence key={'wipe-' + from} from={Math.max(0, from - 12)} durationInFrames={24}>
      <Wipe tone={i % 3 === 0 ? '#65c8ed' : i % 3 === 1 ? '#f3a66b' : '#d8e3f3'}/>
    </Sequence>)}
    <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,.10), transparent 20%, transparent 80%, rgba(0,0,0,.18))'}}/>
  </AbsoluteFill>
);
