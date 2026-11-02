import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,interpolate,spring} from 'remotion';
import {OpeningVisualV2} from './talentstream-opening-v2';

const C={bg:'#080E17',ink:'#F8FAFD',soft:'#D8E2EF',muted:'#98A7BA',orange:'#FF6B00',warm:'#FFAD77',green:'#34D4A1',sky:'#67B4FF',violet:'#B6A0FF',line:'#334356',card:'#15202E',paper:'#F7F9FC',darkText:'#152031'};
const T={intake:180,match:423,agni:769,insights:1164,review:1385,end:1606};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x);};
const go=(f:number,start:number,duration=17)=>ease((f-start)/duration);
const exit=(f:number,start:number,duration=18)=>1-go(f,start,duration);
const vis=(f:number,start:number,duration=17)=>({opacity:go(f,start,duration),transform:'translateY('+((1-go(f,start,duration))*33)+'px)'});
const css=(left:number,top:number,width:number,height:number,background:string,border='#2D4054'):React.CSSProperties=>({position:'absolute',left,top,width,height,background,border:'1px solid '+border,borderRadius:25,boxShadow:'0 23px 75px #00000023',overflow:'hidden'});
const ftxt=(size:number,color= C.ink,weight:React.CSSProperties['fontWeight']=800):React.CSSProperties=>({fontSize:size,color,fontWeight:weight,lineHeight:1.14,letterSpacing:-0.6});
const Badge:React.FC<{children:React.ReactNode;color?:string;bg?:string}> = ({children,color=C.orange,bg='#FFF0E6'})=><div style={{display:'inline-flex',alignItems:'center',borderRadius:50,padding:'9px 17px',fontWeight:800,letterSpacing:1.1,fontSize:17,color,background:bg}}>{children}</div>;
const Dot:React.FC<{color?:string;size?:number}>=({color=C.green,size=10})=><div style={{width:size,height:size,background:color,borderRadius:size,flexShrink:0}}/>;
const MiniLine:React.FC<{width?:number;color?:string}>=({width=110,color='#B2BCC9'})=><div style={{width,height:8,background:color,borderRadius:8}}/>;
const ScreenHeader:React.FC<{label:string;section:string}> = ({label,section})=><div style={{position:'absolute',left:96,top:58,right:96,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
  <div style={{display:'flex',alignItems:'center',gap:14}}>
    <div style={{width:44,height:44,borderRadius:11,background:C.orange,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:19}}>TS</div>
    <div style={{fontSize:29,fontWeight:900,color:C.ink}}>TalentStream <span style={{color:C.warm}}>AI</span></div>
  </div>
  <span style={{fontSize:19,color:C.muted,fontWeight:800,letterSpacing:3}}>{section.toUpperCase()} / {label.toUpperCase()}</span>
</div>;
const SceneBase:React.FC<{children:React.ReactNode;theme?:'light'|'dark';section:string;label:string}> = ({children,theme='dark',section,label})=><AbsoluteFill style={{overflow:'hidden',fontFamily:'Lato,Inter,Arial,sans-serif',background:theme==='light'?'#F4F6FB':C.bg}}>
  <div style={{position:'absolute',width:1150,height:900,left:1110,top:30,background:'radial-gradient(ellipse at center,#233A5B50 0%,transparent 67%)',opacity:theme==='light'?.1:.65}}/>
  <ScreenHeader section={section} label={label}/>
  {children}
</AbsoluteFill>;
const Head:React.FC<{label:string;title:string;subtitle:string;light?:boolean}> = ({label,title,subtitle,light})=><div style={{position:'absolute',left:95,top:148}}>
 <div style={{fontSize:18,fontWeight:900,letterSpacing:3,color:light?'#AC510D':C.warm}}>{label}</div>
 <div style={{fontSize:64,fontWeight:900,color:light?C.darkText:C.ink,letterSpacing:-2,marginTop:15}}>{title}</div>
 <div style={{fontSize:26,fontWeight:500,color:light?'#64748B':C.muted,marginTop:12}}>{subtitle}</div>
</div>;
const UserBadge:React.FC<{name:string;color?:string}> = ({name,color=C.orange})=><div style={{width:44,height:44,borderRadius:50,background:color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:900,color:'#fff'}}>{name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>;

const ResumeIcon:React.FC<{name:string;status?:string;color?:string;small?:boolean}> = ({name,status='PARSED',color=C.orange,small})=><div style={{display:'flex',gap:12,alignItems:'center',padding:small?'10px 12px':'13px 16px',borderRadius:15,background:'#fff',border:'1px solid #E3E9F1',boxShadow:'0 6px 24px #14283B0C'}}>
  <UserBadge name={name} color={color}/><div style={{flex:1}}><div style={{fontSize:20,fontWeight:850,color:C.darkText}}>{name}</div><div style={{fontSize:14,color:'#718096'}}>Application received</div></div><Badge color="#15855E" bg="#E3FAF0">{status}</Badge>
</div>;

const RoleScene:React.FC=()=>{
 const f=useCurrentFrame();
 const jobActive=go(f,14),resumeActive=go(f,84);
 const applicants=[['Aisha Sharma',C.orange],['Rahul Mehta',C.sky],['Neha Iyer',C.violet],['Maya Kapoor',C.green]];
 const count=Math.floor(interpolate(f,[81,177],[0,200],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
 return <SceneBase section="01" label="INCOMING TALENT">
   <Head label="START WITH A ROLE" title="Define once. Bring everyone in." subtitle="One workspace. Every requirement. Every applicant."/>
   <div style={{...css(94,372,725,496,C.paper),...vis(f,5)}}>
     <div style={{position:'absolute',left:34,top:28,fontSize:17,color:'#607286',fontWeight:900,letterSpacing:2}}>NEW JOB REQUISITION</div>
     <div style={{position:'absolute',left:34,top:85,...ftxt(37,C.darkText)}}>Senior Backend Engineer</div>
     <div style={{position:'absolute',left:34,top:139,fontSize:20,color:'#657386'}}>Engineering · Full-time · Remote</div>
     <div style={{position:'absolute',left:34,right:34,top:200,height:1,background:'#E1E6EF'}}/>
     <div style={{position:'absolute',left:34,top:225,fontSize:17,fontWeight:850,color:'#6A788A',letterSpacing:1}}>REQUIRED EXPERIENCE</div>
     <div style={{position:'absolute',left:34,top:267,display:'flex',flexWrap:'wrap',gap:12,width:650}}>
       {['Node.js','PostgreSQL','System design','APIs & integrations'].map((x,i)=><div key={x} style={{...vis(f,36+i*11,12),padding:'13px 17px',borderRadius:13,background:'#FFF0E6',fontSize:22,fontWeight:850,color:'#B64E0A'}}>{x}</div>)}
     </div>
     <div style={{position:'absolute',left:34,right:34,bottom:26,borderRadius:14,padding:17,background:'#E6F7F0',display:'flex',alignItems:'center',gap:13,opacity:jobActive}}><Dot color="#19A76D"/><span style={{fontSize:21,fontWeight:800,color:'#16694F'}}>Job requirements ready</span></div>
   </div>
   <div style={{position:'absolute',left:833,top:617,width:70,height:5,borderRadius:8,background:C.orange,transform:'scaleX('+resumeActive+')',transformOrigin:'left'}}/>
   <div style={{...css(918,372,904,496,C.paper),...vis(f,69)}}>
     <div style={{position:'absolute',top:27,left:30,fontSize:17,color:'#607286',fontWeight:900,letterSpacing:2}}>RESUME INTAKE</div>
     <div style={{position:'absolute',left:30,top:67,fontSize:73,color:C.darkText,fontWeight:900,lineHeight:1}}>{String(count).padStart(3,'0')}</div>
     <div style={{position:'absolute',left:190,top:96,fontSize:25,color:'#64748B'}}>candidates indexed</div>
     <div style={{position:'absolute',left:31,top:171,right:31,display:'grid',gap:10}}>
       {applicants.map(([name,color],i)=><div key={name} style={vis(f,94+i*20,14)}><ResumeIcon name={name} color={color}/></div>)}
     </div>
   </div>
  </SceneBase>;
};

const candidateData=[
 {name:'Aisha Sharma',role:'Backend Engineer',score:92,color:C.orange,skills:['Node.js','PostgreSQL','API design'],gap:'Cloud architecture'},
 {name:'Rahul Mehta',role:'Platform Developer',score:84,color:C.sky,skills:['TypeScript','REST APIs','Observability'],gap:'Database depth'},
 {name:'Neha Iyer',role:'Data Engineer',score:77,color:C.violet,skills:['Python','SQL','ETL pipelines'],gap:'Node.js'},
];
const Ring:React.FC<{score:number;color:string;progress:number}>=({score,color,progress})=>{
 const deg=360*(score/100)*progress;
 return <div style={{position:'relative',width:150,height:150}}>
   <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'conic-gradient('+color+' '+deg+'deg, #E7EDF3 '+deg+'deg)',display:'grid',placeItems:'center'}}>
    <div style={{width:120,height:120,borderRadius:'50%',background:'#fff',display:'grid',placeItems:'center'}}><div style={{fontSize:38,fontWeight:900,color:C.darkText}}>{Math.round(score*progress)}%</div></div>
   </div>
 </div>;
};
const MatchScene:React.FC=()=>{
 const f=useCurrentFrame();
 const focus=go(f,196,23);
 return <SceneBase section="02" label="EXPLAINABLE MATCHING">
  <Head label="AI MATCHING" title={focus>.8?'A shortlist you can explain.':'Match the skills. See the evidence.'} subtitle={focus>.8?'No mystery ranking. The reasoning is right here.':'Job requirements matched against candidate experience.'}/>
  <div style={{position:'absolute',left:96,top:375,right:96,display:'flex',gap:24,opacity:1-focus,transform:'translateX('+(-70*focus)+'px)'}}>
   {candidateData.map((candidate,i)=>{
    const start=18+i*14;
    return <div key={candidate.name} style={{...css(0,0,0,0,'transparent'),position:'relative',width:556,height:442,background:C.paper,border:'1px solid #DFE8F2',borderRadius:25,boxShadow:'0 17px 55px #0002',padding:28,boxSizing:'border-box',...vis(f,start,17)}}>
       <div style={{display:'flex',gap:15,alignItems:'center'}}><UserBadge name={candidate.name} color={candidate.color}/><div><div style={ftxt(25,C.darkText)}>{candidate.name}</div><div style={{fontSize:17,color:'#64748B'}}>{candidate.role}</div></div></div>
       <div style={{marginTop:32,display:'flex',alignItems:'center',gap:34}}>
        <Ring score={candidate.score} color={candidate.color} progress={go(f,55+i*14,32)}/>
        <div style={{display:'grid',gap:17}}>
         {candidate.skills.map((skill,j)=><div key={skill} style={{display:'flex',alignItems:'center',gap:12,opacity:go(f,98+i*12+j*8,13)}}><Dot color="#20B884"/><div style={{fontSize:22,color:C.darkText,fontWeight:800}}>{skill}</div></div>)}
        </div>
       </div>
       <div style={{position:'absolute',left:28,bottom:22,width:500,background:'#FFF4EA',borderRadius:14,padding:'13px 18px',fontSize:19,color:'#9E5018',fontWeight:800,opacity:go(f,147+i*8,15)}}>TO VERIFY  /  {candidate.gap}</div>
      </div>;
   })}
  </div>
  <div style={{position:'absolute',left:96,top:376,right:96,height:450,opacity:focus,transform:'translateY('+((1-focus)*30)+'px)',display:'flex',gap:26}}>
   <div style={{...css(0,0,617,448,C.paper),position:'relative',padding:38,boxSizing:'border-box'}}>
     <div style={{display:'flex',gap:22,alignItems:'center'}}><UserBadge name="Aisha Sharma"/><div><div style={ftxt(34,C.darkText)}>Aisha Sharma</div><div style={{fontSize:20,color:'#65758A'}}>Senior Backend Engineer</div></div></div>
     <div style={{display:'flex',alignItems:'center',gap:28,marginTop:32}}><Ring score={92} color={C.orange} progress={1}/><div><div style={{...ftxt(34,C.darkText)}}>Strong match</div><div style={{fontSize:21,color:'#64748B',marginTop:11}}>Top candidate for review</div></div></div>
     <div style={{marginTop:22}}><Badge>EXPLAINABLE RESULT</Badge></div>
   </div>
   <div style={{...css(0,0,1069,448,C.paper),position:'relative',padding:38,boxSizing:'border-box'}}>
     <div style={{fontSize:20,fontWeight:900,color:'#65758A',letterSpacing:1.4}}>MATCH RATIONALE</div>
     {[
      ['REQUIRED SKILLS','Node.js, PostgreSQL and API design evidenced',C.green],
      ['TECHNICAL STRENGTH','Backend integrations and systems experience',C.sky],
      ['FOLLOW-UP GAP','Confirm cloud deployment architecture',C.orange],
     ].map(([key,info,col],i)=><div key={key} style={{marginTop:21,padding:'19px 24px',borderRadius:17,background:i===2?'#FFF1E6':'#F1F5FA',display:'flex',alignItems:'center',gap:18,opacity:go(f,220+i*19,13)}}>
        <Dot color={col}/><div><div style={{fontSize:15,fontWeight:900,color:'#627185',letterSpacing:1.4}}>{key}</div><div style={{fontSize:25,color:C.darkText,fontWeight:850,marginTop:6}}>{info}</div></div>
       </div>)}
   </div>
  </div>
 </SceneBase>;
};

const LiveWave:React.FC<{frame:number;active:number}>=({frame,active})=><div style={{height:134,display:'flex',alignItems:'center',gap:6,opacity:active}}>
 {Array.from({length:68},(_,i)=>{
  const height=14+Math.abs(Math.sin(frame*.13+i*.4)*Math.cos(i*.17+frame*.048))*112;
  return <div key={i} style={{width:6,height:height+'px',borderRadius:5,background:i%5===0?C.warm:C.orange}}/>;
 })}
</div>;
const AgniScene:React.FC=()=>{
 const f=useCurrentFrame();
 const live=go(f,98,17);
 const responses=[
   {from:'AGNI',txt:'Describe your backend experience.',time:144,color:C.orange},
   {from:'CANDIDATE',txt:'Node.js APIs, Postgres, and integrations.',time:210,color:C.sky},
   {from:'AGNI',txt:'How do you design reliable retries?',time:268,color:C.orange},
   {from:'CANDIDATE',txt:'Idempotency keys and bounded backoff.',time:326,color:C.sky},
 ];
 return <SceneBase section="03" label="AGNI SCREENING">
   <Head label="AI VOICE SCREENING" title="Beyond the résumé." subtitle="A consent-aware conversation that becomes usable evidence."/>
   <div style={{...css(95,367,1087,486,C.card),...vis(f,4)}}>
      <div style={{position:'absolute',top:31,left:36,right:35,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
       <div><div style={{fontSize:16,fontWeight:900,color:C.muted,letterSpacing:2}}>VOICE SCREENING SESSION</div><div style={{fontSize:32,color:C.ink,fontWeight:900,marginTop:12}}>Aisha Sharma <span style={{fontSize:20,color:C.muted,fontWeight:500}}>· Backend Engineer</span></div></div>
       <div style={{display:'flex',alignItems:'center',gap:10,borderRadius:40,padding:'12px 18px',background:live?'#183A32':'#273344'}}><Dot color={live?C.green:C.warm}/><span style={{fontSize:18,color:live?'#85F0C8':C.warm,fontWeight:900}}>{live?'CONSENT VERIFIED':'CONNECTING'}</span></div>
      </div>
      <div style={{position:'absolute',left:39,top:174,display:'flex',gap:23,alignItems:'center',opacity:go(f,15,18)}}>
       <div style={{height:72,width:72,background:C.orange,borderRadius:45,display:'grid',placeItems:'center',color:'#fff',fontSize:29,fontWeight:900}}>AS</div>
       <div style={{height:4,width:89,background:'#35485C',borderRadius:6}}/>
       <div style={{height:72,width:72,background:'#34465C',borderRadius:45,display:'grid',placeItems:'center',color:C.warm,fontSize:31,fontWeight:900}}>AI</div>
       <span style={{fontSize:26,fontWeight:900,color:C.ink}}>Agni</span>
      </div>
      <div style={{position:'absolute',left:38,top:293,display:'flex',gap:10,alignItems:'center'}}><LiveWave frame={f} active={live}/></div>
      <div style={{position:'absolute',left:38,bottom:28,right:38,borderTop:'1px solid #334459',paddingTop:20,display:'flex',gap:17,alignItems:'center'}}>
       {['CONSENT RECORDED','RELEVANT QUESTIONS','RESPONSES CAPTURED'].map((s,i)=><div key={s} style={{borderRadius:40,padding:'12px 18px',background:i===0?'#16372E':'#203047',color:i===0?'#85ECC8':C.soft,fontWeight:900,fontSize:16,opacity:go(f,94+i*67,16)}}>{s}</div>)}
      </div>
   </div>
   <div style={{...css(1205,367,620,486,C.paper),...vis(f,57)}}>
      <div style={{position:'absolute',left:28,top:29,fontSize:18,fontWeight:900,color:'#596B82',letterSpacing:1.6}}>CONVERSATION → EVIDENCE</div>
      <div style={{position:'absolute',left:26,top:89,right:26,display:'grid',gap:15}}>
       {responses.map((r,i)=><div key={r.txt} style={{opacity:go(f,r.time,14),transform:'translateX('+((1-go(f,r.time,14))*30)+'px)',padding:'15px 17px',borderRadius:14,background:i%2?'#EFF4FB':'#FFF3E9',border:'1px solid #E5E8EF'}}>
         <div style={{fontSize:13,fontWeight:900,color:i%2?'#4777A7':'#BD5A11',letterSpacing:1.3}}>{r.from}</div>
         <div style={{fontSize:18,color:C.darkText,fontWeight:750,marginTop:5}}>{r.txt}</div>
        </div>)}
      </div>
   </div>
 </SceneBase>;
};

const InsightScene:React.FC=()=>{
 const f=useCurrentFrame();
 const transcripts=[['AGNI','Tell me about your backend experience.'],['AISHA','I build APIs with Node and Postgres.'],['AGNI','How do you handle retries?'],['AISHA','Idempotency keys and backoff.']];
 const parsed=[
   {title:'TECHNICAL DEPTH',detail:'Node.js, PostgreSQL, APIs',color:C.green},
   {title:'RELIABILITY',detail:'Idempotency and retry patterns',color:C.sky},
   {title:'REQUIRES FOLLOW-UP',detail:'Cloud architecture / deployment',color:C.orange}
 ];
 return <SceneBase section="04" label="STRUCTURED INSIGHTS">
  <Head label="AFTER THE CALL" title="Conversations become context." subtitle="Readable transcripts. Structured evidence. Clear follow-ups."/>
  <div style={{...css(95,369,770,496,C.paper),...vis(f,7)}}>
    <div style={{padding:'28px 30px',fontSize:18,color:'#65748A',fontWeight:900,letterSpacing:1.7}}>SCREENING TRANSCRIPT</div>
    <div style={{padding:'0 29px',display:'grid',gap:15}}>
     {transcripts.map(([who,what],i)=><div key={i} style={{background:who==='AGNI'?'#FFF2E8':'#EEF3FA',borderRadius:14,padding:'15px 18px',opacity:go(f,22+i*15,13),transform:'translateY('+((1-go(f,22+i*15,13))*20)+'px)'}}>
       <div style={{fontSize:14,color:who==='AGNI'?'#B24E0B':'#54749B',fontWeight:900,letterSpacing:1.3}}>{who}</div>
       <div style={{marginTop:6,fontSize:21,color:C.darkText,fontWeight:720}}>{what}</div>
      </div>)}
    </div>
  </div>
  <div style={{position:'absolute',left:880,top:601,width:69,height:5,background:C.orange,borderRadius:9,transform:'scaleX('+go(f,83,18)+')',transformOrigin:'left'}} />
  <div style={{...css(967,369,858,496,C.paper),...vis(f,72)}}>
    <div style={{padding:'28px 32px',fontSize:18,color:'#65748A',fontWeight:900,letterSpacing:1.7}}>RECRUITER-READY REPORT</div>
    <div style={{padding:'4px 31px',display:'grid',gap:18}}>
     {parsed.map((r,i)=><div key={r.title} style={{border:'1px solid #E2E8EF',borderRadius:15,background:'#fff',padding:'18px 20px',opacity:go(f,98+i*24,16),transform:'translateX('+((1-go(f,98+i*24,16))*34)+'px)'}}>
       <div style={{display:'flex',alignItems:'center',gap:11}}><Dot color={r.color}/><span style={{fontSize:15,fontWeight:900,letterSpacing:1.5,color:'#61718A'}}>{r.title}</span></div>
       <div style={{fontSize:25,color:C.darkText,fontWeight:850,marginTop:11}}>{r.detail}</div>
      </div>)}
    </div>
  </div>
 </SceneBase>;
};

const ReviewScene:React.FC=()=>{
 const f=useCurrentFrame();
 const confirm=go(f,145,16);
 const steps=['APPLIED','MATCHED','SCREENED','REVIEWED','MANAGER'];
 return <SceneBase section="05" label="HUMAN REVIEW">
   <Head label="HUMAN-LED DECISION" title="AI brings the evidence. You decide." subtitle="Review the reasoning, choose the next step, hand off context."/>
   <div style={{...css(95,369,1086,492,C.paper),...vis(f,3)}}>
     <div style={{padding:31,display:'flex',gap:16,alignItems:'center',borderBottom:'1px solid #E2E9F0'}}><UserBadge name="Aisha Sharma"/><div><div style={ftxt(28,C.darkText)}>Aisha Sharma</div><div style={{fontSize:18,color:'#62748A'}}>Senior Backend Engineer · AI screening completed</div></div><div style={{marginLeft:'auto'}}><Badge color="#14835F" bg="#E1FAEF">READY FOR REVIEW</Badge></div></div>
     <div style={{padding:'24px 30px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:17}}>
       {[
        ['EXPLAINABLE MATCH','92% match against role'],['SCREENING EVIDENCE','Structured technical notes'],
        ['FOLLOW-UP QUESTION','Cloud architecture depth'],['RECRUITER DECISION','Select next hiring stage']
       ].map((v,i)=><div key={v[0]} style={{padding:22,borderRadius:15,background:'#F1F5F9',opacity:go(f,24+i*15,14),border:i===3?'1px solid #FEB77E':'1px solid #E4EAF2'}}>
          <div style={{fontSize:14,letterSpacing:1.6,fontWeight:900,color:'#64748B'}}>{v[0]}</div><div style={{fontSize:22,color:C.darkText,fontWeight:850,marginTop:9}}>{v[1]}</div>
         </div>)}
     </div>
     <div style={{display:'flex',gap:18,padding:'4px 30px',alignItems:'center',opacity:go(f,105,13)}}>
       <div style={{padding:'18px 27px',borderRadius:13,fontSize:23,fontWeight:900,color:'#fff',background:confirm?'#188F67':C.orange}}> {confirm?'✓ SENT TO MANAGER':'SEND TO MANAGER'} </div>
       <div style={{fontSize:19,color:'#64748B'}}>Human review required before handoff</div>
     </div>
   </div>
   <div style={{...css(1203,369,619,492,C.card),...vis(f,65)}}>
     <div style={{padding:27,fontSize:18,color:C.muted,fontWeight:900,letterSpacing:2}}>HIRING PIPELINE</div>
     <div style={{margin:'7px 30px',display:'grid',gap:13}}>
       {steps.map((x,i)=><div key={x} style={{display:'flex',gap:16,alignItems:'center',padding:'17px 20px',borderRadius:14,background:i===4&&confirm?'#213A35':'#213044',opacity:go(f,78+i*14,15)}}>
        <div style={{fontSize:14,fontWeight:900,color:C.warm,width:36}}>{String(i+1).padStart(2,'0')}</div>
        <div style={{fontSize:22,fontWeight:850,color:C.ink,flex:1}}>{x}</div><Dot color={i===4&&!confirm?'#697B8D':C.green}/>
       </div>)}
     </div>
   </div>
 </SceneBase>;
};

const OutroScene:React.FC=()=>{
 const f=useCurrentFrame();
 const a=go(f,8,18),b=go(f,96,18),c=go(f,143,16);
 return <SceneBase section="TALENTSTREAM" label="THE FUTURE OF HIRING">
   <div style={{position:'absolute',left:116,top:242,opacity:a,transform:'translateY('+((1-a)*46)+'px)'}}>
    <div style={{fontSize:22,fontWeight:900,letterSpacing:4,color:C.warm}}>FROM NOISE TO CONFIDENCE</div>
    <div style={{fontSize:93,color:C.ink,fontWeight:950,letterSpacing:-4,marginTop:29}}>200 resumes.</div>
    <div style={{fontSize:87,color:C.warm,fontWeight:950,letterSpacing:-3,marginTop:4}}>One clear decision.</div>
    <div style={{height:2,width:650,background:'#364A60',marginTop:43}}/>
    <div style={{fontSize:54,color:C.ink,fontWeight:920,marginTop:35,opacity:b}}>TalentStream <span style={{color:C.orange}}>AI</span></div>
    <div style={{fontSize:53,fontWeight:900,color:C.ink,marginTop:27,opacity:c}}>Smarter screening.</div>
    <div style={{fontSize:54,fontWeight:900,color:C.warm,marginTop:6,opacity:c}}>Human-first hiring.</div>
   </div>
   <div style={{position:'absolute',right:122,top:310,width:450,height:450,opacity:go(f,39,20),borderRadius:45,background:'#142033',border:'1px solid #3E5166',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:13}}>
    <div style={{height:142,width:142,borderRadius:33,background:C.orange,display:'grid',placeItems:'center',color:'#fff',fontSize:83,fontWeight:900,boxShadow:'0 0 96px #FF6B0033'}}>AI</div>
    <div style={{fontSize:30,fontWeight:900,color:C.ink,letterSpacing:1.1}}>TALENTSTREAM</div>
    <div style={{fontSize:20,color:C.muted}}>Recruitment intelligence</div>
   </div>
 </SceneBase>;
};

const Subtitles:React.FC=()=>{
 const f=useCurrentFrame();const s=f/30;
 const cues=[
 [0,3.1,'Two hundred resumes. Countless details.'],
 [3.53,6.34,'One thing hiring teams need: a clear decision.'],
 [6.78,7.67,'Start with a role.'],
 [8,13.74,'Define requirements, import resumes, and bring every applicant into one organized workspace.'],
 [14.1,20.35,'AI evaluates profiles against the job: match scores, technical strengths, and gaps.'],
 [20.7,25.12,'Not a mystery ranking. A shortlist recruiters can explain.'],
 [25.64,28.38,'Next, Agni takes screening beyond the résumé.'],
 [28.73,38.42,'With consent recorded, Agni asks relevant questions and captures responses as evidence.'],
 [38.81,45.78,'After the call, transcripts become structured insights and areas for follow-up.'],
 [46.17,51.1,'Recruiters review the evidence and hand context to hiring managers.'],
 [51.49,53.13,'People remain in control.'],
 [53.54,56.42,'From two hundred resumes to one clear decision.'],
 [56.78,57.95,'TalentStream AI.'],
 [58.28,61.05,'Smarter screening. Human-first hiring.']
 ] as const;
 const cue=cues.find(x=>s>=x[0]&&s<x[1]);
 if(!cue)return null;
 return <div style={{position:'absolute',bottom:75,left:96,maxWidth:1400,padding:'9px 20px',background:'#0A1221D9',borderRadius:8,fontSize:22,lineHeight:1.25,fontWeight:700,color:'#F6F8FF'}}>{cue[2]}</div>;
};

export const TalentStreamV4:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:C.bg,fontFamily:'Lato,Inter,Arial,sans-serif'}}>
  <Sequence from={0} durationInFrames={T.intake}><OpeningVisualV2/></Sequence>
  <Sequence from={T.intake} durationInFrames={T.match-T.intake}><RoleScene/></Sequence>
  <Sequence from={T.match} durationInFrames={T.agni-T.match}><MatchScene/></Sequence>
  <Sequence from={T.agni} durationInFrames={T.insights-T.agni}><AgniScene/></Sequence>
  <Sequence from={T.insights} durationInFrames={T.review-T.insights}><InsightScene/></Sequence>
  <Sequence from={T.review} durationInFrames={T.end-T.review}><ReviewScene/></Sequence>
  <Sequence from={T.end} durationInFrames={1860-T.end}><OutroScene/></Sequence>
  <Subtitles/>
  <Audio src={staticFile('narration.mp3')} volume={1}/>
  <Audio src={staticFile('instrumental.wav')} volume={0.11}/>
 </AbsoluteFill>;
};
