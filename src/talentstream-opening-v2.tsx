import React from 'react';
import {
  AbsoluteFill, Audio, Easing, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';

// Six-second audio-led opener. All timings below are in seconds, not frames.
const C = {
  bg: '#070C14', white: '#F5F7FB', orange: '#FF7428',
  pale: '#FFBC8E', muted: '#9EABB9', border: '#334356',
};
const files = [
  {name: 'Aisha M.', role: 'PRODUCT ENGINEER', x: 1156, y: 257, tilt: -9},
  {name: 'Rahul K.', role: 'FULL-STACK DEV', x: 1440, y: 225, tilt: 5},
  {name: 'Maya S.', role: 'DATA ENGINEER', x: 1234, y: 440, tilt: 6},
  {name: 'Neha P.', role: 'BACKEND DEV', x: 1510, y: 454, tilt: -7},
  {name: 'Kabir R.', role: 'AI ENGINEER', x: 1110, y: 632, tilt: 8},
  {name: 'Tara J.', role: 'SOFTWARE DEV', x: 1436, y: 658, tilt: -5},
];
const clamp = (v: number) => Math.max(0, Math.min(1, v));

export const OpeningVisualV2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const rise = (start: number, end: number) => interpolate(t, [start, end], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const overload = 1 - rise(1.42, 1.75);
  const analysis = rise(1.76, 2.16) * (1 - rise(3.44, 3.78));
  const decision = rise(3.80, 4.20);
  const exit = 1 - rise(5.72, 6.0);
  const phases = [
    {index: '01', title: 'THE NOISE', opacity: overload, headline: <>200 <span style={{color:C.orange}}>RESUMES.</span></>, subtitle: 'Countless details. One hiring decision.'},
    {index: '02', title: 'THE SIGNAL', opacity: analysis, headline: <>FIND THE<br/><span style={{color:C.orange}}>SIGNAL.</span></>, subtitle: 'Skills. Experience. Evidence.'},
    {index: '03', title: 'THE DECISION', opacity: decision, headline: <>FROM NOISE<br/>TO <span style={{color:C.orange}}>CLARITY.</span></>, subtitle: 'Evidence-first. Human-led.'},
  ];

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(ellipse 850px 580px at 75% 49%, #1B2A3B 0%, transparent 75%), linear-gradient(130deg, #0C1623 0%, #060B13 74%)',
      color: C.white, fontFamily: 'Inter, Lato, Arial, sans-serif', overflow: 'hidden',
    }}>

      {/* Original procedural backgrounds: fine architectural grid, dot matrix, film grain. */}
      <AbsoluteFill style={{
        opacity: 0.23,
        backgroundImage: 'linear-gradient(#7590A616 1px,transparent 1px),linear-gradient(90deg,#7590A616 1px,transparent 1px)',
        backgroundSize: '72px 72px',
        backgroundPosition: `${Math.round(-t*4)}px 0px`,
      }}/>
      <AbsoluteFill style={{
        opacity: 0.30,
        backgroundImage: 'radial-gradient(#93A8B52A 1px,transparent 1px)',
        backgroundSize: '19px 19px', maskImage: 'linear-gradient(90deg, transparent 36%, black)',
      }}/>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080"
        style={{position:'absolute',inset:0,opacity:0.10,pointerEvents:'none'}}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.44" numOctaves="2" stitchTiles="stitch"/></filter>
        <rect width="1920" height="1080" filter="url(#grain)" opacity="0.75"/>
      </svg>
      <div style={{
        position: 'absolute', width: 720, height: 720, top: 160, left: 1110, borderRadius: '50%',
        border: '1px solid #F78D372B', boxShadow: '0 0 0 120px #FF742807, 0 0 0 250px #FF742804',
        transform: `scale(${1+t*0.012})`,
      }}/>

      {/* Brand and editorial framing. */}
      <div style={{position:'absolute',left:96,top:65,display:'flex',alignItems:'center',gap:17}}>
        <div style={{width:45,height:45,background:C.orange,borderRadius:11,display:'grid',placeItems:'center',fontSize:22,fontWeight:950,color:'#111722'}}>TS</div>
        <span style={{fontSize:29,fontWeight:850,letterSpacing:-0.7}}>TalentStream <span style={{color:C.orange}}>AI</span></span>
      </div>
      <div style={{position:'absolute',right:99,top:84,fontSize:14,fontWeight:800,letterSpacing:5,color:'#A8B6C8'}}>
        HIRING, REIMAGINED
      </div>
      <div style={{position:'absolute',left:96,top:235,width:840,height:535}}>
        {phases.map((p) => <div key={p.index} style={{
          position:'absolute',left:0,top:0,width:840,
          opacity:clamp(p.opacity)*exit,
          transform:`translateY(${(1-clamp(p.opacity))*30}px)`,
        }}>
          <div style={{fontSize:18,fontWeight:850,letterSpacing:6,color:C.pale,marginBottom:27}}>
            {p.index} / {p.title}
          </div>
          <div style={{fontSize:104,fontWeight:900,lineHeight:1.075,letterSpacing:-6.1,whiteSpace:'nowrap'}}>
            {p.headline}
          </div>
          <div style={{fontSize:32,color:C.muted,marginTop:35,fontWeight:450,letterSpacing:0.1}}>
            {p.subtitle}
          </div>
        </div>)}
      </div>

      {/* Beat one: crowded applicant snapshots, intentionally not orbiting a magic AI logo. */}
      {files.map((person,i)=>{
        const appear=rise(0.12+i*0.10,0.56+i*0.10);
        const float=t*7*(i%2===0?1:-1);
        const disappear=1-rise(1.55+i*0.06,2.06+i*0.06);
        return <div key={person.name} style={{
          position:'absolute',left:person.x,top:person.y,width:260,height:135,
          padding:'23px 21px',boxSizing:'border-box',borderRadius:14,
          background:'linear-gradient(125deg,#293C50F2,#152233F2)',
          border:'1px solid #8090A243',boxShadow:'0 22px 70px #0009',
          transform:`translate3d(0,${(1-appear)*46+float}px,0) rotate(${person.tilt*(1-rise(1.3,2.08))}deg) scale(${0.93+appear*0.07})`,
          opacity:appear*disappear*exit,
        }}>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <div style={{width:40,height:40,borderRadius:10,display:'grid',placeItems:'center',background:i%3===0?'#E8793B':'#52677B',fontSize:18,fontWeight:800}}>{person.name[0]}</div>
            <div>
              <div style={{fontSize:17,fontWeight:820}}>{person.name}</div>
              <div style={{fontSize:9,letterSpacing:1.4,color:'#B7C5D2',marginTop:5}}>{person.role}</div>
            </div>
          </div>
          <div style={{display:'flex',gap:7,marginTop:19}}>
            {[56,37,42].map((w,j)=><div key={j} style={{height:7,width:w,borderRadius:6,background:j===0?'#FF873A60':'#7B91A54B'}}/>)}
          </div>
        </div>;
      })}

      {/* Beat two: visually trace what the system extracts instead of depicting an arbitrary AI icon. */}
      <div style={{position:'absolute',left:1047,top:298,width:735,opacity:analysis*exit}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:33,alignItems:'center'}}>
          <div style={{fontSize:14,letterSpacing:4,fontWeight:850,color:C.pale}}>STRUCTURED EVIDENCE</div>
          <div style={{fontSize:13,letterSpacing:2,color:C.muted}}>ANALYZING</div>
        </div>
        {[
          {label:'SKILLS',percentage:0.91,sub:'Technical capability'},
          {label:'EXPERIENCE',percentage:0.76,sub:'Relevant background'},
          {label:'ROLE REQUIREMENTS',percentage:0.86,sub:'Job-related signals'},
        ].map((item,i)=> <div key={item.label} style={{
          height:130,background:'#182638DF',border:'1px solid #6A84923A',
          borderRadius:16,marginBottom:17,padding:'22px 29px',boxSizing:'border-box',
          transform:`translateX(${(1-rise(1.6+i*0.16,2.16+i*0.16))*80}px)`,
        }}>
          <div style={{display:'flex',justifyContent:'space-between',fontWeight:830,fontSize:17,letterSpacing:2}}>
            <span>{item.label}</span><span style={{color:C.pale,fontSize:14}}>{item.sub}</span>
          </div>
          <div style={{height:8,background:'#334357',borderRadius:5,marginTop:26,overflow:'hidden'}}>
            <div style={{width:`${item.percentage*100*rise(1.98+i*0.18,2.83+i*0.18)}%`,height:'100%',background:'linear-gradient(90deg,#F56B24,#FFBB79)',borderRadius:5,boxShadow:'0 0 20px #F56B2490'}}/>
          </div>
        </div>)}
      </div>

      {/* Beat three: end on human judgment supported by evidence. */}
      <div style={{
        position:'absolute',left:1110,top:285,width:650,height:514,
        borderRadius:28,boxSizing:'border-box',padding:'39px 43px',
        background:'linear-gradient(145deg,#23374BED,#0D1B2BEF)',
        border:'1px solid #ED9B5861',boxShadow:'0 35px 110px #000C, 0 0 90px #F47B1625',
        transform:`translateY(${(1-decision)*56}px) scale(${0.94+decision*0.06})`,
        opacity:decision*exit,
      }}>
        <div style={{fontSize:15,letterSpacing:4,fontWeight:900,color:C.pale}}>EVIDENCE-LED REVIEW</div>
        <div style={{height:1,background:'#758AA047',margin:'29px 0 32px'}}/>
        <div style={{display:'flex',gap:24,alignItems:'center'}}>
          <div style={{height:90,width:90,borderRadius:22,background:'linear-gradient(145deg,#E87C39,#8D4C31)',display:'grid',placeItems:'center',fontSize:41,fontWeight:850}}>A</div>
          <div>
            <div style={{fontSize:36,fontWeight:880,letterSpacing:-1}}>Candidate profile</div>
            <div style={{fontSize:20,color:C.muted,marginTop:8}}>Structured, reviewable evidence</div>
          </div>
        </div>
        <div style={{display:'flex',gap:13,marginTop:37}}>
          {['SKILLS','EXPERIENCE','ROLE FIT'].map(item=><div key={item}
            style={{fontSize:14,letterSpacing:1.3,fontWeight:850,padding:'15px 18px',borderRadius:11,
              color:'#F1F5FA',background:'#334D61',border:'1px solid #6C849B50'}}>
            {item}
          </div>)}
        </div>
        <div style={{position:'absolute',bottom:35,left:43,right:43,display:'flex',justifyContent:'space-between',alignItems:'center',
          borderTop:'1px solid #758AA047',paddingTop:27}}>
          <span style={{fontSize:17,color:'#B4C4D3'}}>Built for better decisions</span>
          <span style={{padding:'13px 21px',borderRadius:9,background:C.orange,color:'#17202B',fontSize:16,fontWeight:900}}>HUMAN-LED →</span>
        </div>
      </div>

      {/* A 6s sequence progress indicator gives every beat its own distinct space. */}
      <div style={{position:'absolute',left:96,bottom:83,right:96,display:'flex',gap:18}}>
        {['INPUT','EVIDENCE','DECISION'].map((s,i)=><div key={s} style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:850,letterSpacing:3,marginBottom:14,color:t>=i*2?'#F2D3BA':'#758597'}}>
            0{i+1} / {s}
          </div>
          <div style={{height:4,background:'#5060745A',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${100*clamp((t-i*2)/2)}%`,background:C.orange}}/>
          </div>
        </div>)}
      </div>
      <AbsoluteFill style={{opacity:1-exit,background:C.bg,pointerEvents:'none'}}/>
    </AbsoluteFill>
  );
};

export const TalentStreamOpeningV2: React.FC = () => <AbsoluteFill>
  <OpeningVisualV2/>
  <Audio src={staticFile('narration.mp3')} volume={1}/>
  <Audio src={staticFile('instrumental.wav')} volume={0.11}/>
</AbsoluteFill>;
