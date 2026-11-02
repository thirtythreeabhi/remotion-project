import React from 'react';
import {AbsoluteFill,Audio,Sequence,interpolate,useCurrentFrame,staticFile,Easing} from 'remotion';

const P={navy:'#121B29',deep:'#0C1521',paper:'#F7F7F4',white:'#FFFFFF',ink:'#1D2734',muted:'#66758A',blue:'#5575EE',teal:'#3ABBA7',yellow:'#F7C96B',lightBlue:'#E9EEFF',border:'#DDE4EC'};
const CUTS=[0,151,319,422,630,768,901,1051,1251,1498,1656,1761,1891];
const smooth=(v:number)=>{const x=Math.min(1,Math.max(0,v));return x*x*(3-2*x);};
const enter=(f:number,t=0,d=20)=>smooth((f-t)/d);
const drift=(f:number,s=1)=>Math.sin(f/35)*s;
const tx=(f:number,t=0,d=20,y=38):React.CSSProperties=>({opacity:enter(f,t,d),transform:'translateY('+((1-enter(f,t,d))*y)+'px)'});
const spanStyle=(size:number,color=P.ink,weight=800):React.CSSProperties=>({fontSize:size,color,fontWeight:weight,lineHeight:1.07,letterSpacing:-1.5});
const pp=(s:string)=>staticFile('wordbase/'+s);
const pill=(label:string,color=P.blue,background=P.lightBlue)=> <span style={{borderRadius:30,padding:'10px 20px',background,color,fontSize:19,fontWeight:800,letterSpacing:.2,whiteSpace:'nowrap'}}>{label}</span>;
const Dots:React.FC<{dark?:boolean}>=({dark})=><div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient('+(dark?'#FFFFFF14':'#1D365D13')+' 1.6px, transparent 1.6px)',backgroundSize:'26px 26px',opacity:.9,pointerEvents:'none'}}/>;
const Mark:React.FC<{light?:boolean}>=({light})=><div style={{display:'flex',alignItems:'center',gap:15,color:light?P.white:P.ink}}>
 <div style={{width:44,height:44,background:P.blue,borderRadius:14,display:'grid',placeItems:'center',fontSize:26,fontWeight:1000,color:P.white,letterSpacing:-4,paddingRight:5}}>W</div>
 <div style={{fontSize:25,fontWeight:950,letterSpacing:3}}>WORDBASE</div>
 </div>;
const Canvas:React.FC<{children:React.ReactNode,dark?:boolean,scene?:string}>=({children,dark,scene})=>{
 const f=useCurrentFrame();return <AbsoluteFill style={{overflow:'hidden',fontFamily:'Lato,Arial,sans-serif',color:dark?P.white:P.ink,background:dark?P.deep:P.paper}}>
 <div style={{position:'absolute',inset:0,background:dark?'radial-gradient(circle at 75% 45%,#1B3154 0%,transparent 48%), radial-gradient(circle at 10% 100%,#16283A 0%,transparent 42%)':'radial-gradient(circle at 85% 30%,#E4EBFF 0%,transparent 46%), radial-gradient(circle at 0% 85%,#E8F4F0 0%,transparent 38%)'}}/>
 <Dots dark={dark}/><div style={{position:'absolute',top:44,left:68,display:'flex',zIndex:10,alignItems:'center'}}><Mark light={dark}/></div>
 <div style={{position:'absolute',right:72,top:56,color:dark?'#B5C8DC':P.muted,letterSpacing:2.4,fontSize:15,fontWeight:900,zIndex:10}}>{(scene||'PERSONAL LEARNING PROJECT').toUpperCase()}</div>
 {children}
 <div style={{position:'absolute',bottom:29,left:68,right:68,display:'flex',justifyContent:'space-between',fontSize:15,fontWeight:800,letterSpacing:1.8,color:dark?'#9EB3C8':P.muted,zIndex:50}}>
  <span>ABHIJEET SINGH SANDAL  /  EXPLORING BY BUILDING</span><span>WORDBASE · 2026</span>
 </div><div style={{position:'absolute',bottom:0,height:4,left:0,background:P.blue,width:'100%',transform:'scaleX('+Math.min(1,f/1891)+')',transformOrigin:'left'}}/>
 </AbsoluteFill>;
};
const Browser:React.FC<{children:React.ReactNode;style?:React.CSSProperties;path?:string}>=({children,style,path='study / my workspace'})=><div style={{background:'#FFF',borderRadius:25,overflow:'hidden',boxShadow:'0 30px 95px #172B4B33',border:'1px solid #CED7E4',...style}}>
 <div style={{height:50,background:'#F2F5FA',borderBottom:'1px solid #DEE6F0',display:'flex',alignItems:'center',gap:9,padding:'0 22px'}}>{['#FF8A86','#F4C863','#62D1A0'].map(x=><div key={x} style={{height:11,width:11,borderRadius:9,background:x}}/>)}<div style={{background:P.white,border:'1px solid #E5EAF1',borderRadius:8,marginLeft:18,padding:'6px 22px',width:360,fontSize:14,color:'#8291A2'}}>wordbase  /  {path}</div></div>
 {children}
 </div>;
const Chip:React.FC<{children:React.ReactNode;solid?:boolean;teal?:boolean}>=({children,solid,teal})=><div style={{display:'inline-flex',alignItems:'center',borderRadius:12,padding:'12px 18px',fontSize:20,fontWeight:800,background:solid?P.blue:teal?'#E1F5F0':'#EFF2FB',color:solid?'#FFF':teal?'#247E73':'#506180',border:'1px solid '+(solid?P.blue:'#DEE5F4')}}>{children}</div>;
const ExampleCard:React.FC<{reveal?:number;notes?:boolean;scale?:number}>=({reveal=0,notes=false,scale=1})=><div style={{width:805,height:474,borderRadius:24,background:'linear-gradient(140deg,#F6F8FF,#E3EAFE)',border:'1px solid #CAD5F1',boxShadow:'0 30px 75px #263B7830',padding:38,position:'relative',transform:'scale('+scale+')',transformOrigin:'center'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><Chip>Distributed Systems</Chip><div style={{color:P.muted,fontSize:25}}>↗　☆</div></div>
 <div style={{fontSize:62,fontWeight:950,color:P.navy,marginTop:60,letterSpacing:-2.5}}>Consistent hashing</div>
 {reveal>=1 && <div style={{display:'flex',gap:9,marginTop:30}}><Chip>Hash ring</Chip><Chip>Load balancing</Chip><Chip>Virtual nodes</Chip></div>}
 {reveal>=2 && <div style={{color:'#485777',fontSize:23,lineHeight:1.36,marginTop:25,maxWidth:690}}>Distributes keys around a ring, minimizing remapping when nodes are added or removed.</div>}
 <div style={{position:'absolute',bottom:27,left:39,fontSize:16,color:'#8592AC',fontWeight:750}}>SPACE / ENTER TO REVEAL MORE</div><div style={{position:'absolute',bottom:24,right:38,fontSize:24,color:'#596DB4'}}>←　→</div>
 </div>;
const SectionTitle:React.FC<{eyebrow:string;head:React.ReactNode;desc?:string;dark?:boolean}>=({eyebrow,head,desc,dark})=><div>
 <div style={{fontSize:19,color:dark?P.teal:P.blue,letterSpacing:3.3,fontWeight:950}}>{eyebrow.toUpperCase()}</div>
 <div style={{...spanStyle(77,dark?P.white:P.ink),marginTop:20}}>{head}</div>
 {desc&&<div style={{fontSize:27,color:dark?'#ACC0D4':P.muted,lineHeight:1.37,marginTop:25,maxWidth:560,fontWeight:450}}>{desc}</div>}
 </div>;
const Opening:React.FC=()=>{const f=useCurrentFrame();const notes=[['Context switching',115,210,-14,5],['B+ Trees',1030,186,9,2],['Embeddings',835,490,16,10],['TCP handshake',115,625,-7,16],['Caching',595,680,11,23],['Branch prediction',1035,670,-9,30]];
 return <Canvas dark scene="01 / THE QUESTION"><div style={{position:'absolute',left:115,top:305,zIndex:10}}>
 <div style={{color:P.teal,fontSize:23,fontWeight:900,letterSpacing:3,...tx(f,0,12)}}>A PROBLEM I KEPT RUNNING INTO</div>
 <div style={{...spanStyle(102,P.white,950),marginTop:24,...tx(f,4,18)}}>Learn something.</div>
 <div style={{...spanStyle(111,P.yellow,950),marginTop:10,...tx(f,31,19)}}>Forget it.</div>
 <div style={{marginTop:31,width:610,height:5,background:'#FFFFFF26',borderRadius:20}}><div style={{height:'100%',width:(100*(1-enter(f,36,70)))+'%',background:P.teal}}/></div>
 </div>
 {notes.map(([name,x,y,r,delay],i)=><div key={i} style={{position:'absolute',left:x as number,top:y as number,padding:'18px 28px',background:i%2===0?'#EAF0FF':'#DDF4EB',color:P.navy,fontWeight:850,borderRadius:16,fontSize:23,boxShadow:'0 14px 40px #0005',opacity:Math.max(0,enter(f,delay as number,15)*(1-enter(f,80+i*8,35))),transform:'rotate('+(r as number)+'deg) translateY('+(drift(f+i*16,11))+'px)',filter:'blur('+(enter(f,105+i*5,20)*3)+'px)'}}>{name}</div>)}
 </Canvas>;
};
const Scatter:React.FC=()=>{const f=useCurrentFrame();const terms=['Pointers','CPU Cache','Queues','Load Balancing','Transactions','Neural Networks','Threads','Vector Search','Binary Trees'];
 return <Canvas dark scene="02 / THE NEED">
 <div style={{position:'absolute',left:110,top:180,width:670,...tx(f,4)}}><SectionTitle dark eyebrow="Curiosity everywhere" head={<>So many ideas.<br/><span style={{color:P.yellow}}>Nowhere to keep them.</span></>} desc="A place to revisit what I learn, instead of letting it disappear."/></div>
 <div style={{position:'absolute',right:125,top:210,width:670,height:610,borderRadius:36,border:'2px dashed #557EA270',background:'#15253BBD'}}>
 {terms.map((s,i)=>{const angle=i*2.399;const radius=75+(i%4)*60;const x=335+Math.cos(angle)*radius;const y=300+Math.sin(angle)*radius;const k=enter(f,25+i*6,24);return <div key={s} style={{position:'absolute',left:x-75,top:y-22,opacity:k,transform:'rotate('+((-8+i*3)*(1-k))+'deg) scale('+(.8+.2*k)+')',padding:'14px 18px',border:'1px solid #58708C',borderRadius:14,background:'#253A55',fontSize:19,fontWeight:800,whiteSpace:'nowrap'}}>{s}</div>})}
 <div style={{position:'absolute',top:255,left:270,width:118,height:118,borderRadius:38,background:P.blue,display:'grid',placeItems:'center',fontSize:75,fontWeight:950,boxShadow:'0 0 75px #4D75EF99',transform:'scale('+(0.82+.18*enter(f,56,20))+')'}}>W</div>
 </div></Canvas>;
};
const LogoReveal:React.FC=()=>{const f=useCurrentFrame();return <Canvas dark scene="03 / BUILT FOR MYSELF">
 <div style={{position:'absolute',top:177,left:110,width:930,...tx(f,3,18)}}><div style={{color:P.teal,fontSize:22,letterSpacing:3.2,fontWeight:900}}>A SMALL PROJECT. A PERSONAL REASON.</div><div style={{...spanStyle(118,P.white,950),marginTop:36}}>So I built<br/><span style={{color:P.yellow}}>Wordbase.</span></div><div style={{fontSize:34,color:'#B1C3D8',marginTop:43}}>A personal space for learning, revisiting, and exploring.</div></div>
 <div style={{position:'absolute',right:165,top:255,width:450,height:460,background:'radial-gradient(circle,#5575EE88,transparent 68%)'}}/>
 <div style={{position:'absolute',right:250,top:322,width:290,height:290,borderRadius:80,background:P.blue,transform:'rotate('+interpolate(f,[0,100],[-13,0])+'deg) scale('+(0.7+.3*enter(f,5,35))+')',boxShadow:'0 35px 120px #427AFF44',display:'grid',placeItems:'center',fontSize:204,fontWeight:950}}>W</div>
 </Canvas>};
const Cards:React.FC=()=>{const f=useCurrentFrame();const stage=f<80?0:f<143?1:2;return <Canvas scene="04 / FLASHCARDS"><div style={{position:'absolute',top:160,left:110,...tx(f,3)}}><SectionTitle eyebrow="Study at my own pace" head={<>Understand it,<br/><span style={{color:P.blue}}>layer by layer.</span></>} desc="Concepts, keywords, short explanations, then deeper context."/></div>
 <div style={{position:'absolute',right:95,top:204,transform:'perspective(1500px) rotateY('+interpolate(f,[0,205],[9,-2])+'deg) translateY('+drift(f,6)+'px)',...{opacity:enter(f,4,22)}}}>
 <Browser style={{width:1005,paddingBottom:35}} path="study"><div style={{background:'#F9FBFD',padding:'23px 28px',display:'flex',gap:11,alignItems:'center'}}><Chip>Computer Science　⌄</Chip><Chip>All topics　⌄</Chip><div style={{marginLeft:'auto',fontWeight:800,color:P.muted}}>⇄ Shuffle　　 ◎ Focus　　 Notes</div></div>
 <div style={{padding:36,display:'grid',placeItems:'center'}}><ExampleCard reveal={stage} scale={.97}/></div>
 </Browser></div>
 <div style={{position:'absolute',top:805,left:115,display:'flex',gap:14}}>{pill('TAP TO REVEAL')}{pill('LEARN IN LAYERS','#23786F','#DDF3EA')}</div>
 </Canvas>};
const DeepDive:React.FC=()=>{const f=useCurrentFrame();return <Canvas scene="05 / MORE DEPTH">
 <div style={{position:'absolute',top:180,left:110,...tx(f,3)}}><SectionTitle eyebrow="Understanding matters" head={<>Not just a<br/><span style={{color:P.blue}}>definition.</span></>} desc="Break down concepts until the explanation actually sticks."/></div>
 <div style={{position:'absolute',top:166,right:105,width:890,...tx(f,10,20)}}><Browser path="study / concept details"><div style={{padding:44,background:'#FEFEFF',minHeight:570}}>
 <div style={{color:P.muted,fontWeight:900,letterSpacing:1.6,fontSize:18}}>COMPUTER SCIENCE  /  DISTRIBUTED SYSTEMS</div>
 <div style={{...spanStyle(57),marginTop:20}}>Consistent hashing</div><div style={{display:'flex',gap:14,marginTop:25}}><Chip>Hash ring</Chip><Chip>Virtual nodes</Chip></div>
 <div style={{marginTop:36,padding:25,borderRadius:19,background:'#F2F5FC',fontSize:25,color:'#42546C',lineHeight:1.5}}>A technique that distributes data across nodes while reducing the number of keys moved when machines join or leave.</div>
 <div style={{marginTop:22,opacity:enter(f,48,25),padding:25,border:'1px solid #D7E3F8',borderRadius:17,background:'#F9FBFF',fontSize:22,color:'#485A73',lineHeight:1.45}}><span style={{fontWeight:950,color:P.blue}}>Why it matters</span><div style={{marginTop:10}}>Fewer remapped keys means less disruption when scaling distributed caches and storage.</div></div>
 </div></Browser></div>
 </Canvas>};
const Notes:React.FC=()=>{const f=useCurrentFrame();return <Canvas scene="06 / MY NOTES & HISTORY">
 <div style={{position:'absolute',left:104,top:166,...tx(f)}}><SectionTitle eyebrow="Make it memorable" head={<>Save. Reflect.<br/><span style={{color:P.blue}}>Come back.</span></>} desc="My notes, bookmarked concepts, and a persistent study history."/></div>
 <div style={{position:'absolute',right:80,top:190,width:925,display:'flex',gap:25,transform:'rotate('+drift(f,.7)+'deg)'}}>
 <div style={{width:444,height:590,background:'#FFF',border:'1px solid #D9E3F2',borderRadius:23,boxShadow:'0 25px 70px #22324E22',padding:32,...tx(f,4,20)}}>
 <div style={{display:'flex',justifyContent:'space-between',fontSize:24,fontWeight:950}}><span>My notes</span><span style={{color:P.blue}}>✎</span></div><div style={{marginTop:34,color:P.muted,fontSize:18}}>CONSISTENT HASHING</div><div style={{fontSize:26,marginTop:30,fontWeight:850}}>Why I want to remember this</div><div style={{fontSize:23,color:'#526279',lineHeight:1.56,marginTop:20}}>Useful for distributed caching, scaling services, and understanding how systems move data.</div><div style={{marginTop:42,padding:17,background:'#EAF6F1',borderRadius:13,color:'#24866C',fontSize:19,fontWeight:850}}>✓ Note saved</div>
 </div>
 <div style={{width:435,height:590,background:'#FDFEFE',border:'1px solid #D9E3F2',borderRadius:23,boxShadow:'0 25px 70px #22324E22',padding:32,...tx(f,27,20)}}>
 <div style={{fontSize:25,fontWeight:950}}>Recently studied</div>{[['Consistent hashing','Today'],['Branch prediction','Yesterday'],['Database indexing','Recently'],['Event loop','Recently']].map((a,i)=><div key={a[0]} style={{borderBottom:'1px solid #E5EBF2',padding:'26px 4px',opacity:enter(f,45+i*12,16),display:'flex',justifyContent:'space-between',gap:10}}><span style={{fontSize:22,fontWeight:750}}>{a[0]}</span><span style={{fontSize:17,color:P.muted}}>{a[1]}</span></div>)}
 <div style={{marginTop:35,display:'flex',gap:10}}><Chip>☆ Bookmarks</Chip></div>
 </div>
 </div></Canvas>};
const Quiz:React.FC=()=>{const f=useCurrentFrame();return <Canvas scene="07 / ACTIVE RECALL">
 <div style={{position:'absolute',left:105,top:168,...tx(f)}}><SectionTitle eyebrow="The real test" head={<>Can I actually<br/><span style={{color:P.blue}}>recall it?</span></>} desc="Not just reading the answer — testing whether I remember it."/></div>
 <div style={{position:'absolute',right:80,top:165,width:942,...tx(f,9,21)}}>
 <Browser path="quiz / active recall"><div style={{background:'#FCFDFF',padding:48,height:616}}><div style={{fontSize:19,letterSpacing:2.2,color:P.blue,fontWeight:950}}>QUICK QUIZ　/　ACTIVE RECALL</div>
 <div style={{display:'flex',justifyContent:'space-between',marginTop:35,alignItems:'center'}}><div style={{fontSize:21,color:P.muted}}>QUESTION 1 OF 12</div><Chip>Computer Science</Chip></div><div style={{height:9,background:'#E6ECF9',borderRadius:20,marginTop:16}}><div style={{background:P.blue,height:9,width:'8%',borderRadius:20}}/></div>
 <div style={{fontSize:44,fontWeight:950,color:P.ink,marginTop:44}}>What is consistent hashing?</div>
 <div style={{fontSize:22,color:P.muted,marginTop:14}}>Recall the answer before revealing it.</div>
 <div style={{background:'#F3F6FD',padding:25,borderRadius:16,fontSize:21,color:'#60708B',marginTop:29,height:92}}>Type what you remember...</div>
 <div style={{background:P.blue,borderRadius:15,padding:'18px 30px',fontSize:21,color:P.white,fontWeight:850,width:170,textAlign:'center',marginTop:24,opacity:enter(f,32,16)}}>Check answer</div>
 <div style={{position:'absolute',right:55,bottom:83,opacity:enter(f,93,20),fontSize:19,color:'#1E987A',fontWeight:900}}>✓ Review strengthens recall</div>
 </div></Browser></div>
 </Canvas>};
const Code:React.FC=()=>{const f=useCurrentFrame();return <Canvas dark scene="08 / ENGINEERING">
 <div style={{position:'absolute',left:100,top:177,...tx(f,2,24)}}><SectionTitle dark eyebrow="The unexpected part" head={<>Building it was<br/><span style={{color:P.yellow}}>another lesson.</span></>} desc="I wanted to learn concepts. I ended up learning a lot about the system behind them."/></div>
 <div style={{position:'absolute',right:82,top:179,width:862,height:615,background:'#101F35',border:'1px solid #3E526D',borderRadius:28,boxShadow:'0 27px 65px #0004',overflow:'hidden',...tx(f,12,22)}}>
 <div style={{padding:'19px 30px',background:'#192A42',display:'flex',gap:9}}>{['#EF8080','#E8BC64','#67C49B'].map(s=><i key={s} style={{width:13,height:13,borderRadius:13,background:s}}/>)}
 <span style={{marginLeft:29,fontSize:17,color:'#A5BAD0'}}>wordbase / src / server</span></div>
 <div style={{padding:45,fontFamily:'monospace',fontSize:26,lineHeight:2.05}}>
 {[
 ['01','const',' app = ','Next.js'],
 ['02','const',' language = ','TypeScript'],
 ['03','const',' persistence = ','Drizzle + Postgres'],
 ['04','const',' auth = ','Neon Auth'],
 ['05','const',' learning = ','React + Curiosity'],
 ].map(([line,key,eq,val],i)=><div key={line} style={{opacity:enter(f,24+i*15,15),whiteSpace:'nowrap'}}><span style={{color:'#56718E'}}>{line}　</span><span style={{color:'#B69DFE'}}>{key}</span><span style={{color:'#CAD4E1'}}>{eq}</span><span style={{color:i===4?'#F7C96B':'#82D7CA'}}>{'"'+val+'"'}</span><span style={{color:'#9FAFC3'}}>;</span></div>)}
 </div><div style={{height:1,background:'#3B4E66',margin:'0 45px'}}/><div style={{fontSize:21,color:'#A5B8CF',margin:'33px 45px'}}>Build experiments → observe behavior → refine.</div>
 </div></Canvas>};
const Recs:React.FC=()=>{const f=useCurrentFrame();const pts=[[205,220],[205,420],[205,620],[680,420],[1200,210],[1200,420],[1200,630]];return <Canvas dark scene="09 / RECOMMENDATION LOGIC">
 <div style={{position:'absolute',left:105,top:145,...tx(f,0,17)}}><SectionTitle dark eyebrow="Technical curiosity" head={<>How do you make<br/><span style={{color:P.yellow}}>learning feel relevant?</span></>} desc="I explored embeddings, similarity, and ranking signals."/></div>
 <svg width="900" height="650" style={{position:'absolute',right:65,top:155,overflow:'visible'}} viewBox="0 0 900 650">
 {[[180,105,440,330],[180,305,440,330],[180,505,440,330],[440,330,710,140],[440,330,710,335],[440,330,710,525]].map((a,i)=><path key={i} d={'M'+a[0]+','+a[1]+' C'+(a[0]+95)+','+a[1]+' '+(a[2]-90)+','+a[3]+' '+a[2]+','+a[3]} fill="none" stroke={i%2?P.teal:P.blue} strokeWidth={i===3?5:3} strokeDasharray="9 12" opacity={enter(f,10+i*8,20)*.75} strokeDashoffset={-f*(.6+i*.1)}/>)}
 <g><rect x="10" y="60" width="230" height="90" rx="18" fill="#223552" stroke="#4D6A91"/><text x="33" y="114" fill="white" fontSize="25" fontWeight="bold">Saved topics</text></g>
 <g><rect x="10" y="260" width="230" height="90" rx="18" fill="#223552" stroke="#4D6A91"/><text x="33" y="314" fill="white" fontSize="25" fontWeight="bold">Study history</text></g>
 <g><rect x="10" y="460" width="230" height="90" rx="18" fill="#223552" stroke="#4D6A91"/><text x="33" y="514" fill="white" fontSize="25" fontWeight="bold">Embedding vectors</text></g>
 <g opacity={enter(f,42,22)}><circle cx="455" cy="330" r="93" fill="#465E9B" stroke="#83A3FF" strokeWidth="3"/><text x="455" y="320" fill="white" textAnchor="middle" fontSize="25" fontWeight="bold">Ranking</text><text x="455" y="351" fill="#C5D4EE" textAnchor="middle" fontSize="18">score</text></g>
 {['Due for review','Related interests','Explore new'].map((s,i)=><g key={s} opacity={enter(f,71+i*17,20)}><rect x="680" y={95+i*195} width="230" height="91" rx="18" fill={i===0?'#2F6565':'#243C65'} stroke="#608FA2"/><text x="698" y={149+i*195} fill="white" fontSize="24" fontWeight="bold">{s}</text></g>)}
 </svg>
 <div style={{position:'absolute',bottom:125,left:107,display:'flex',gap:12}}>{pill('GEMINI EMBEDDINGS','#2AC6B4','#174137')}{pill('SIMILARITY','#D5E3FF','#324A70')}{pill('REVIEW SIGNALS','#D5E3FF','#324A70')}</div>
 </Canvas>};
const Backend:React.FC=()=>{const f=useCurrentFrame();return <Canvas scene="10 / FULL-STACK EXPERIMENTS">
 <div style={{position:'absolute',left:105,top:163,...tx(f,2)}}><SectionTitle eyebrow="Under the hood" head={<>More than<br/><span style={{color:P.blue}}>a flashcard UI.</span></>} desc="Authentication, persistence, AI enrichment, and study workflows."/></div>
 <div style={{position:'absolute',right:100,top:185,width:945,height:586,display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
 {[['AUTHENTICATION','Account-based study data','◎','#DFEBFF'],['DATABASE','Postgres + Drizzle','▦','#DFF2EE'],['AI ENRICHMENT','Model fallback pipeline','✳','#FFF0D4'],['STUDY WORKFLOWS','Cards, notes, quizzes','▤','#EDE4FD']].map(([a,b,s,c],i)=><div key={a} style={{background:'#FFF',border:'1px solid #DDE6F2',borderRadius:24,padding:32,boxShadow:'0 15px 40px #23334F16',...tx(f,13+i*15,20)}}>
 <div style={{height:80,width:80,borderRadius:24,background:c,display:'grid',placeItems:'center',fontSize:49,color:P.blue}}>{s}</div>
 <div style={{fontSize:18,color:P.blue,fontWeight:950,letterSpacing:1.8,marginTop:23}}>{a}</div><div style={{fontSize:28,fontWeight:850,marginTop:11}}>{b}</div></div>)}
 </div></Canvas>};
const Human:React.FC=()=>{const f=useCurrentFrame();return <Canvas dark scene="11 / WHY IT EXISTS">
 <div style={{position:'absolute',top:185,left:113,...tx(f)}}><SectionTitle dark eyebrow="A small realization" head={<>AI can organize<br/><span style={{color:P.yellow}}>information.</span></>} desc="But understanding is still something I have to build myself."/></div>
 <div style={{position:'absolute',right:154,top:170,display:'grid',placeItems:'center',width:680,height:630}}>
 <div style={{width:520,height:520,borderRadius:'50%',border:'1px solid #59779D',boxShadow:'0 0 100px #4866AD3F',transform:'scale('+(0.8+enter(f,12,50)*.2)+')'}}/>
 <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',border:'2px dashed #4D92A0',transform:'rotate('+(f*.4)+'deg)'}}/>
 <div style={{position:'absolute',fontSize:155,fontWeight:900,color:P.white,textShadow:'0 10px 60px #6495FF99'}}>?</div><div style={{position:'absolute',bottom:65,color:P.teal,fontSize:25,fontWeight:900,letterSpacing:4}}>KEEP ASKING QUESTIONS</div>
 </div></Canvas>};
const Ending:React.FC=()=>{const f=useCurrentFrame();return <Canvas dark scene="12 / THE REASON">
 <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 65% 50%,#263F65 0%,transparent 58%)'}}/>
 <div style={{position:'absolute',left:115,top:219,...tx(f,1,19)}}><div style={{fontSize:24,color:P.teal,letterSpacing:3,fontWeight:950}}>NOT A STARTUP. NOT A PITCH.</div>
 <div style={{...spanStyle(107,P.white,950),marginTop:32}}>Just curiosity,<br/><span style={{color:P.yellow}}>turned into code.</span></div>
 <div style={{fontSize:29,color:'#B3C6DA',marginTop:37}}>Wordbase — a personal learning experiment.</div>
 <div style={{fontSize:22,color:P.teal,letterSpacing:2.2,marginTop:74,fontWeight:950}}>BUILT BY ABHIJEET SINGH SANDAL</div></div>
 <div style={{position:'absolute',right:174,top:324,width:275,height:275,borderRadius:73,background:P.blue,display:'grid',placeItems:'center',fontSize:187,fontWeight:950,boxShadow:'0 38px 115px #3B66E366',transform:'rotate('+interpolate(f,[0,120],[12,0])+'deg) scale('+(0.75+.25*enter(f,15,35))+')'}}>W</div>
 </Canvas>};
const SCENES=[Opening,Scatter,LogoReveal,Cards,DeepDive,Notes,Quiz,Code,Recs,Backend,Human,Ending];
export const WordbasePortfolio:React.FC=()=> <AbsoluteFill style={{background:P.deep}}>{SCENES.map((S,i)=><Sequence key={i} from={CUTS[i]} durationInFrames={CUTS[i+1]-CUTS[i]}><S/></Sequence>)}<Audio src={pp('narration.mp3')} volume={1}/></AbsoluteFill>;
