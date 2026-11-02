import React from 'react';
import {AbsoluteFill, Audio, Sequence, Freeze, useCurrentFrame, interpolate, Easing, staticFile} from 'remotion';

/**
 * Wordbase Portfolio — UI-first cut.
 * Visual tokens and copy adapted from wordbase/src/styles.css and StudyWorkspace.tsx.
 * Speech section boundaries match verified silence locations from Wordbase-Guddu-timing.json.
 * Interior action cues are editorial estimates, NOT forced word alignment.
 */
const C = {paper:'#f6f5f1',white:'#ffffff',ink:'#282925',heading:'#2d302b',green:'#354e40',sage:'#56775b',terracotta:'#cc7850',muted:'#85877e',line:'#e9e8e1',mint:'#eef2ed',salmon:'#f6e9de',beige:'#f7f6f2',lavender:'#f0eafa',blue:'#e8eff5',deep:'#202a22'};
const CUTS=[0,151,319,422,630,768,901,1051,1251,1498,1656,1761,1891];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const show=(f:number,start=0,dur=16)=>ease((f-start)/dur);
const hide=(f:number,end:number,dur=16)=>1-show(f,end-dur,dur);
const rise=(f:number,start=0,dur=16,y=34):React.CSSProperties=>({opacity:show(f,start,dur),transform:'translateY('+((1-show(f,start,dur))*y)+'px)'});
const pop=(f:number,start=0,dur=16):React.CSSProperties=>({opacity:show(f,start,dur),transform:'scale('+(.85+.15*show(f,start,dur))+')'});
const absolute:React.CSSProperties={position:'absolute'};
const font='DM Sans, Arial, sans-serif';
const paperTexture='radial-gradient(#354e4015 0.6px, transparent 0.6px)';
const Surface:React.FC<{children:React.ReactNode,dark?:boolean,number:string,header?:string}>=({children,dark=false,number,header})=><AbsoluteFill style={{overflow:'hidden',background:dark?C.deep:C.paper,color:dark?C.paper:C.ink,fontFamily:font}}>
  <div style={{position:'absolute',inset:0,opacity:dark?.12:.16,backgroundImage:paperTexture,backgroundSize:'12px 12px'}}/>
  <div style={{position:'absolute',top:43,left:76,display:'flex',alignItems:'center',gap:13,zIndex:22}}><Brand dark={dark}/></div>
  <div style={{position:'absolute',top:55,right:76,color:dark?'#aebaae':C.muted,fontSize:17,fontWeight:650,letterSpacing:2,zIndex:22}}>{header||'PERSONAL LEARNING EXPERIMENT'}</div>
  {children}
  <div style={{position:'absolute',left:76,right:76,bottom:32,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:16,fontWeight:650,color:dark?'#aebdae':C.muted,zIndex:30}}>
    <span>ABHIJEET SINGH SANDAL <span style={{margin:'0 12px',color:C.terracotta}}>•</span> BUILT TO LEARN</span><span>{number} / 12　　WORDBASE — 2026</span>
  </div>
  <div style={{position:'absolute',bottom:0,left:0,height:4,width:'100%',background:dark?'#4f5c50':'#ebeae2'}}/>
</AbsoluteFill>;

const Brand:React.FC<{dark?:boolean,large?:boolean}>=({dark=false,large=false})=><div style={{display:'flex',alignItems:'center',gap:large?20:12}}>
  <div style={{position:'relative',width:large?68:35,height:large?68:35}}>
    <div style={{position:'absolute',top:large?15:8,left:large?10:6,width:large?51:25,height:large?51:25,borderRadius:large?15:7,background:dark?'#d1e0d2':'#b2c8b5',transform:'rotate(-9deg)'}}/>
    <div style={{position:'absolute',top:2,left:2,width:large?52:26,height:large?52:26,borderRadius:large?15:7,background:dark?'#d7e4d8':C.green,display:'grid',placeItems:'center',color:dark?C.green:'#e5f2e8',fontWeight:850,fontSize:large?38:19}}>▤</div>
  </div>
  <span style={{fontSize:large?72:29,fontWeight:850,letterSpacing:large?-3:-1.5,color:dark?C.paper:C.heading}}>wordbase<span style={{color:C.terracotta}}>.</span></span>
</div>;
const Eyebrow:React.FC<{children:React.ReactNode,dark?:boolean}>=({children,dark})=><div style={{fontSize:18,fontWeight:800,letterSpacing:3.1,color:dark?'#d29c78':C.terracotta,textTransform:'uppercase',display:'flex',gap:15,alignItems:'center'}}><span style={{display:'inline-block',height:2,width:31,background:C.terracotta}}/>{children}</div>;
const Title:React.FC<{children:React.ReactNode,dark?:boolean,size?:number}>=({children,dark,size=84})=><div style={{fontSize:size,fontWeight:800,letterSpacing:-3.5,lineHeight:1.08,color:dark?C.paper:C.heading}}>{children}</div>;
const Sub:React.FC<{children:React.ReactNode,dark?:boolean}>=({children,dark})=><div style={{fontSize:27,lineHeight:1.47,color:dark?'#bccbbe':C.muted,maxWidth:700}}>{children}</div>;
const Label:React.FC<{children:React.ReactNode,accent?:boolean}>=({children,accent=false})=><span style={{display:'inline-flex',alignItems:'center',border:'1px solid '+(accent?'#d1ddce':'#e7e7df'),background:accent?C.mint:C.white,color:accent?C.green:C.ink,borderRadius:9,padding:'12px 17px',fontSize:20,fontWeight:700}}>{children}</span>;
const UI:React.FC<{children:React.ReactNode,active?:string,heading?:string,style?:React.CSSProperties}>=({children,active='Study',heading='Study',style})=><div style={{height:700,width:1180,display:'flex',background:C.paper,border:'1px solid #ddded6',borderRadius:18,overflow:'hidden',boxShadow:'0 34px 90px #354e4022',...style}}>
  <div style={{width:228,flexShrink:0,background:C.white,borderRight:'1px solid '+C.line,padding:'22px 15px',display:'flex',flexDirection:'column'}}>
    <Brand/><div style={{margin:'36px 12px 13px',color:'#a5a79d',fontSize:13,letterSpacing:1.5,fontWeight:650}}>WORKSPACE</div>
    {['Study','Library','Quiz','Notes','History','Friends','Settings'].map((s,i)=><div key={s} style={{height:54,borderRadius:9,padding:'0 17px',display:'flex',alignItems:'center',fontSize:17,fontWeight:active===s?750:520,background:active===s?C.mint:'transparent',color:active===s?C.green:'#6d726a',marginBottom:6,gap:13}}><span style={{fontSize:19,color:active===s?C.green:'#a3a79f'}}>{['◫','▦','◉','▤','◷','◇','⚙'][i]}</span>{s}</div>)}
    <div style={{marginTop:'auto',background:C.paper,borderRadius:12,padding:'17px 13px',fontSize:15,color:C.terracotta}}>♨　4 day learning streak</div>
    <div style={{display:'flex',alignItems:'center',padding:'22px 4px 3px',gap:11,fontSize:15,fontWeight:700}}><span style={{borderRadius:30,background:'#dce5db',color:C.green,padding:'12px 13px'}}>AS</span> Abhijeet</div>
  </div>
  <div style={{flex:1,minWidth:0}}><div style={{height:61,background:'#ffffff99',borderBottom:'1px solid '+C.line,padding:'0 28px',display:'flex',alignItems:'center',justifyContent:'space-between',color:C.muted,fontSize:16}}>Workspace　/　<strong style={{color:C.ink}}>{heading}</strong><span>● All changes saved　⌘ K</span></div>{children}</div>
</div>;
const Frame:React.FC<{children:React.ReactNode,active?:string,heading?:string,scale?:number,left?:number,top?:number}>=({children,active,heading,scale=1,left=660,top=170})=><div style={{position:'absolute',top,left,transform:'scale('+scale+')',transformOrigin:'top left'}}><UI active={active} heading={heading}>{children}</UI></div>;
const K:React.FC<{children:React.ReactNode}>=({children})=><div style={{fontSize:13,letterSpacing:2.5,fontWeight:800,color:C.terracotta}}>{children}</div>;
const MiniCard:React.FC<{title:string,desc?:string,f:number,from:number,tilt?:number,color?:string}>=({title,desc,f,from,tilt=0,color=C.white})=><div style={{width:360,background:color,border:'1px solid '+C.line,borderRadius:14,padding:26,boxShadow:'0 17px 35px #00000012',opacity:show(f,from,16),transform:'translateY('+(45*(1-show(f,from,16)))+'px) rotate('+tilt+'deg)',fontSize:23,fontWeight:800}}>{title}{desc&&<div style={{fontWeight:500,fontSize:16,lineHeight:1.4,color:C.muted,marginTop:12}}>{desc}</div>}</div>;

const Opening:React.FC=()=>{const f=useCurrentFrame();return <Surface number="01">
 <div style={{position:'absolute',top:210,left:115}}><div style={rise(f,0,14)}><Eyebrow>THE PROBLEM</Eyebrow></div><div style={{marginTop:30,...rise(f,14,17)}}><Title size={105}>Learn something.</Title></div><div style={{marginTop:9,...rise(f,61,17)}}><Title size={115}><span style={{color:C.terracotta}}>Forget it.</span></Title></div><div style={{marginTop:36,...rise(f,104,19)}}><Sub>That kept happening with the things I was curious about.</Sub></div></div>
 <div style={{position:'absolute',right:135,top:200,width:490,height:650}}>
  {['CPU cache','Embeddings','Load balancing','Threads','B+ trees'].map((x,i)=><div key={x} style={{position:'absolute',left:(i%2)*75,top:i*105,width:365,padding:'25px 30px',borderRadius:13,border:'1px solid '+C.line,background:i%2?C.mint:C.white,fontSize:28,fontWeight:720,color:C.green,boxShadow:'0 15px 30px #00000010',opacity:show(f,15+i*13,15)*hide(f,116-i*5,18),transform:'translate('+(show(f,15+i*13,15)*-20)+'px,'+(30-25*show(f,15+i*13,15))+'px) rotate('+([-5,4,-6,5,-2][i])+'deg)'}}>{x}<span style={{float:'right',color:'#a9aa9e'}}>×</span></div>)}
 </div>
 </Surface>};
const Scatter:React.FC=()=>{const f=useCurrentFrame();const terms=['Pointers','Queues','Caching','Neural networks','Processes','API design','Binary trees','SQL joins','Event loop','Vectors','TCP'];return <Surface number="02">
 <div style={{position:'absolute',left:115,top:205,width:770}}><div style={rise(f,0)}><Eyebrow>CURIOSITY, EVERYWHERE</Eyebrow></div><div style={{marginTop:24,...rise(f,11,20)}}><Title size={89}>So many ideas.<span style={{color:C.sage}}> Nowhere to keep them.</span></Title></div><div style={{marginTop:34,...rise(f,40,18)}}><Sub>I wanted to revisit what I learned instead of letting it disappear.</Sub></div></div>
 <div style={{position:'absolute',top:220,right:88,width:840,height:640,border:'1px solid #cddacf',background:'#ffffffae',borderRadius:20,overflow:'hidden'}}>
 <div style={{position:'absolute',left:35,right:35,top:40,height:75,borderRadius:11,border:'1px solid #d9dfd5',display:'flex',alignItems:'center',padding:'0 25px',fontSize:22,fontWeight:750,color:C.green}}>⌕　My learning library<span style={{marginLeft:'auto',color:C.muted,fontSize:15}}>⌘ K</span></div>
 {terms.map((s,i)=>{const x=55+(i%3)*245,y=160+Math.floor(i/3)*115,k=show(f,15+i*9,16);return <div key={s} style={{position:'absolute',left:x,top:y,background:i%3===1?C.mint:i%3===2?C.salmon:C.beige,padding:'20px 23px',fontSize:21,color:C.ink,borderRadius:9,border:'1px solid #e5e6df',fontWeight:650,opacity:k,transform:'translateY('+(42*(1-k))+'px) scale('+(0.9+0.1*k)+')'}}>{s}</div>})}
 <div style={{position:'absolute',right:30,bottom:29,fontSize:18,fontWeight:800,color:C.green,opacity:show(f,138,17)}}>Everything in one place ↗</div>
 </div></Surface>};
const Reveal:React.FC=()=>{const f=useCurrentFrame();return <Surface number="03">
 <div style={{position:'absolute',top:200,left:115,width:1040}}><div style={rise(f,0,13)}><Eyebrow>A PERSONAL EXPERIMENT</Eyebrow></div><div style={{marginTop:28,...rise(f,14,17)}}><Title size={110}>So I built<br/><span style={{color:C.sage}}>Wordbase.</span></Title></div><div style={{marginTop:36,...rise(f,36,18)}}><Sub>My own space to study, revisit and explore computer science concepts.</Sub></div></div>
 <div style={{position:'absolute',right:134,top:315,width:480,height:310,borderRadius:20,background:'#e7ece3',display:'grid',placeItems:'center',transform:'translateY('+(60*(1-show(f,6,27)))+'px) rotate('+((1-show(f,6,27))*9)+'deg)',boxShadow:'0 26px 65px #283b2d22'}}><Brand large/></div>
 <div style={{position:'absolute',right:230,top:755,display:'flex',gap:12,...rise(f,62,20)}}><Label accent>Made for myself</Label><Label>Learning by building</Label></div>
 </Surface>};
const CardScreen:React.FC=()=>{const f=useCurrentFrame();return <Surface number="04" header="STUDY / FLASHCARDS">
 <div style={{position:'absolute',top:190,left:95,width:565}}><div style={rise(f,0)}><Eyebrow>THE STUDY LOOP</Eyebrow></div><div style={{marginTop:22,...rise(f,11,20)}}><Title size={72}>One idea.<br/><span style={{color:C.sage}}>One layer</span><br/>at a time.</Title></div><div style={{marginTop:30,...rise(f,37,18)}}><Sub>Concept. Keywords. Explanation. Then the deeper why.</Sub></div><div style={{marginTop:35,display:'flex',gap:12,...rise(f,102,18)}}><Label accent>↵ Reveal</Label><Label>← → Next card</Label></div></div>
 <div style={{position:'absolute',top:170,left:690,opacity:show(f,0,24),transform:'translateX('+(60*(1-show(f,0,24)))+'px) scale(.94)',transformOrigin:'top left'}}><UI active="Study"><div style={{padding:39}}>
 <K>GOOD MORNING, ABHIJEET</K><div style={{fontSize:32,fontWeight:750,marginTop:12}}>Keep your curiosity going.</div>
 <div style={{marginTop:27,background:C.white,border:'1px solid '+C.line,borderRadius:13,height:455,padding:'24px 26px',boxShadow:'0 5px 20px #35352208',position:'relative'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:17}}><span style={{background:C.mint,padding:'8px 15px',borderRadius:25,color:C.green}}>Distributed systems</span><span style={{color:C.muted}}>☆　↗</span></div>
 <div style={{textAlign:'center',marginTop:67,fontSize:49,fontWeight:780,letterSpacing:-1.7}}>Consistent hashing</div>
 <div style={{display:'flex',justifyContent:'center',gap:9,marginTop:25,opacity:show(f,65,10),transform:'translateY('+(15*(1-show(f,65,10)))+'px)'}}>{['Hash ring','Virtual nodes','Scaling'].map(s=><div key={s} style={{background:C.beige,border:'1px solid '+C.line,borderRadius:6,padding:'12px 13px',fontSize:17}}>{s}</div>)}</div>
 <div style={{fontSize:19,lineHeight:1.45,color:C.muted,textAlign:'center',margin:'22px 45px 0',opacity:show(f,128,14)}}>Distribute keys across nodes while minimizing remapping when machines join or leave.</div>
 <div style={{position:'absolute',bottom:19,left:25,right:25,borderTop:'1px solid '+C.line,paddingTop:16,fontSize:14,color:C.muted,display:'flex',justifyContent:'space-between'}}>SPACE / ENTER TO REVEAL MORE <span>←　→</span></div>
 </div></div></UI></div>
 <div style={{position:'absolute',top:738,right:130,borderRadius:13,padding:'15px 24px',background:C.green,color:C.white,fontSize:23,fontWeight:760,opacity:show(f,125,13)*hide(f,188,20),transform:'translateY('+(-6*show(f,125,13))+'px)'}}>↵　Reveal explanation</div>
 </Surface>};
const Deep:React.FC=()=>{const f=useCurrentFrame();return <Surface number="05" header="STUDY / EXPLANATIONS">
 <div style={{position:'absolute',left:110,top:200,width:670}}><div style={rise(f,0)}><Eyebrow>BEYOND DEFINITIONS</Eyebrow></div><div style={{marginTop:25,...rise(f,12,20)}}><Title size={77}>Don't just<br/>memorize.<br/><span style={{color:C.sage}}>Understand.</span></Title></div><div style={{marginTop:24,...rise(f,35)}}><Sub>Explanations I can actually return to.</Sub></div></div>
 <div style={{position:'absolute',top:205,left:870,width:895,height:560,background:C.white,borderRadius:16,border:'1px solid '+C.line,padding:40,boxShadow:'0 25px 65px #2639261c',opacity:show(f,2,18),transform:'translateX('+(35*(1-show(f,2,18)))+'px)'}}>
 <K>DISTRIBUTED SYSTEMS　/　CONCEPT DETAIL</K><div style={{fontSize:52,fontWeight:780,marginTop:21}}>Consistent hashing</div>
 <div style={{marginTop:25,background:C.beige,padding:27,borderRadius:12,fontSize:25,lineHeight:1.47,color:'#50564e',...rise(f,23,16)}}>Keys are mapped around a logical ring. Adding or removing a node only moves a portion of those keys.</div>
 <div style={{marginTop:23,padding:28,background:C.mint,borderRadius:12,opacity:show(f,66,17),transform:'translateY('+(30*(1-show(f,66,17)))+'px)'}}><div style={{fontSize:19,color:C.green,fontWeight:800}}>WHY IT MATTERS　↗</div><div style={{fontSize:23,lineHeight:1.42,marginTop:13}}>Distributed caches scale without requiring every key to be reassigned.</div></div>
 </div></Surface>};
const Notes:React.FC=()=>{const f=useCurrentFrame();return <Surface number="06" header="NOTES / HISTORY">
 <div style={{position:'absolute',left:110,top:190,width:620}}><div style={rise(f,0)}><Eyebrow>MAKE IT STICK</Eyebrow></div><div style={{marginTop:27,...rise(f,11,19)}}><Title size={83}>Save it.<br/>Reflect.<br/><span style={{color:C.sage}}>Return later.</span></Title></div><div style={{marginTop:31,...rise(f,45,16)}}><Sub>Notes, bookmarks, and the trail of things I've studied.</Sub></div></div>
 <div style={{position:'absolute',left:820,top:185,width:480,height:575}}><div style={rise(f,9,19)}><div style={{background:C.white,border:'1px solid '+C.line,borderRadius:15,padding:31,height:555,boxShadow:'0 20px 50px #354e4016'}}><K>MY NOTES　✎</K><div style={{fontSize:33,fontWeight:780,marginTop:32}}>Consistent hashing</div><div style={{fontSize:20,color:C.muted,marginTop:23,lineHeight:1.55}}>Useful when designing distributed caching and systems that scale dynamically.</div><div style={{marginTop:55,background:C.mint,padding:20,borderRadius:10,color:C.green,fontSize:21,fontWeight:750,opacity:show(f,55,15)}}>✓ Note saved</div></div></div></div>
 <div style={{position:'absolute',left:1320,top:240,width:450}}><div style={rise(f,32,18)}><div style={{background:'#fff',border:'1px solid '+C.line,borderRadius:15,padding:'30px 30px 20px',boxShadow:'0 20px 50px #354e4015'}}><K>RECENTLY STUDIED</K>{['Consistent hashing','Branch prediction','Database indexing','Event loop'].map((s,i)=><div key={s} style={{fontSize:21,fontWeight:650,padding:'26px 0',borderBottom:'1px solid '+C.line,opacity:show(f,56+i*15,13),display:'flex',justifyContent:'space-between'}}>{s}<span style={{color:C.terracotta}}>↗</span></div>)}</div></div></div>
 </Surface>};
const Quiz:React.FC=()=>{const f=useCurrentFrame();return <Surface number="07" header="QUIZ / ACTIVE RECALL">
 <div style={{position:'absolute',left:105,top:200,width:630}}><div style={rise(f,0)}><Eyebrow>ACTIVE RECALL</Eyebrow></div><div style={{marginTop:22,...rise(f,10,18)}}><Title size={78}>Do I actually<br/><span style={{color:C.sage}}>remember it?</span></Title></div><div style={{marginTop:29,...rise(f,39)}}><Sub>Reading is easy. Retrieving an answer is the real test.</Sub></div></div>
 <div style={{position:'absolute',left:790,top:185,width:1030,height:575,borderRadius:17,background:C.white,border:'1px solid '+C.line,padding:45,boxShadow:'0 28px 65px #3145311a',opacity:show(f,4,17)}}>
 <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><K>QUICK QUIZ　/　QUESTION 01 OF 12</K><Label accent>Computer science</Label></div>
 <div style={{height:9,background:C.mint,borderRadius:12,marginTop:28}}><div style={{width:(8+show(f,98,22)*13)+'%',height:9,background:C.sage,borderRadius:12}}/></div>
 <div style={{fontSize:40,fontWeight:780,marginTop:48}}>What is consistent hashing?</div>
 <div style={{fontSize:22,color:C.muted,marginTop:14}}>Recall the answer before checking.</div>
 <div style={{height:85,marginTop:33,border:'1px solid #e2e6df',borderRadius:10,background:C.beige,padding:'23px 26px',fontSize:22,color:'#73786f'}}>{f<58?'Type what you remember...':'Keys distributed around a ring'+(f>85?' to reduce remapping.':'')}<span style={{opacity:Math.sin(f/4)>0?1:0}}>|</span></div>
 <div style={{marginTop:23,display:'flex',gap:20,alignItems:'center'}}><div style={{background:C.green,color:C.white,padding:'17px 27px',borderRadius:10,fontSize:21,fontWeight:750}}>Check answer →</div><span style={{fontSize:21,color:C.sage,opacity:show(f,105,13),fontWeight:800}}>✓ Nice work. Revisit again soon.</span></div>
 </div></Surface>};
const Code:React.FC=()=>{const f=useCurrentFrame();const lines=[['const',' framework','=','Next.js'],['const',' language','=','TypeScript'],['const',' database','=','Postgres + Drizzle'],['const',' auth','=','Neon Auth'],['const',' reason','=','curiosity']];return <Surface number="08" dark header="ENGINEERING / LEARNING BY BUILDING">
 <div style={{position:'absolute',left:110,top:185,width:700}}><div style={rise(f,0)}><Eyebrow dark>THE OTHER KIND OF LEARNING</Eyebrow></div><div style={{marginTop:31,...rise(f,12,19)}}><Title size={79} dark>Building it<br/>became <span style={{color:'#b2cbb3'}}>another lesson.</span></Title></div><div style={{marginTop:30,...rise(f,48,16)}}><Sub dark>I started with study cards and ended up exploring the system behind them.</Sub></div></div>
 <div style={{position:'absolute',left:880,top:181,width:915,height:590,border:'1px solid #718373',borderRadius:18,background:'#1a241c',boxShadow:'0 27px 70px #00000024',overflow:'hidden',opacity:show(f,4,18)}}>
 <div style={{height:54,borderBottom:'1px solid #3a473c',padding:'18px 25px',color:'#899e8c',fontSize:17}}>●　wordbase / src / study</div><div style={{padding:'36px 35px',fontFamily:'monospace',fontSize:24,lineHeight:2.6}}>{lines.map((parts,i)=><div key={i} style={{opacity:show(f,17+i*24,12),transform:'translateX('+(20*(1-show(f,17+i*24,12)))+'px)'}}><span style={{color:'#75867a'}}>{String(i+1).padStart(2,'0')}　</span><span style={{color:'#c3ac8a'}}>{parts[0]}</span><span style={{color:'#d6ddd6'}}>{' '+parts[1]+' '+parts[2]+' '}</span><span style={{color:i===4?'#dea17e':'#a5c8ab'}}>{'"'+parts[3]+'"'}</span><span style={{color:'#d6ddd6'}}>;</span></div>)}</div>
 <div style={{borderTop:'1px solid #3b4a3d',margin:'0 35px',paddingTop:22,fontSize:19,color:'#a9b9aa',opacity:show(f,146,16)}}>experiment → debug → refine → learn</div>
 </div></Surface>};
const Recs:React.FC=()=>{const f=useCurrentFrame();const inputs=['Saved concepts','Study history','Embedding similarity'];const outputs=['Due for review','Related concepts','New directions'];return <Surface number="09" dark header="RECOMMENDATIONS / EXPLORATION">
 <div style={{position:'absolute',left:110,top:181,width:690}}><div style={rise(f,0)}><Eyebrow dark>FOLLOW THE CURIOSITY</Eyebrow></div><div style={{marginTop:23,...rise(f,11)}}><Title size={75} dark>What should<br/>I explore <span style={{color:'#b2cbb3'}}>next?</span></Title></div><div style={{marginTop:32,...rise(f,49)}}><Sub dark>Experimenting with embeddings, similarity, and review signals.</Sub></div><div style={{marginTop:35,display:'flex',gap:12,...rise(f,115)}}><Label accent>RANKING</Label><Label>EMBEDDINGS</Label></div></div>
 <div style={{position:'absolute',top:185,right:72,width:995,height:645,border:'1px solid #526255',borderRadius:22,background:'#243126'}}>
 <svg style={{position:'absolute',inset:0}} viewBox="0 0 995 645" width="995" height="645">{inputs.map((s,i)=><path key={s} d={'M 270 '+(120+i*174)+' C 350 '+(120+i*174)+', 350 316, 465 316'} fill="none" stroke={C.terracotta} strokeWidth="3" opacity={show(f,24+i*20,17)} strokeDasharray="12 9" strokeDashoffset={-f*.8}/>)}{outputs.map((s,i)=><path key={s} d={'M 572 316 C 650 316, 645 '+(120+i*174)+', 738 '+(120+i*174)} fill="none" stroke="#a0c2a4" strokeWidth="3" strokeDasharray="12 9" strokeDashoffset={-f} opacity={show(f,112+i*21,18)}/>)}</svg>
 {inputs.map((s,i)=><div key={s} style={{position:'absolute',top:75+i*174,left:37,padding:'21px 20px',width:260,border:'1px solid #617562',background:'#344436',borderRadius:12,fontSize:20,fontWeight:690,opacity:show(f,10+i*20,15)}}>{s}</div>)}
 <div style={{position:'absolute',top:252,left:425,width:170,height:131,background:C.mint,color:C.green,borderRadius:23,display:'grid',placeItems:'center',textAlign:'center',fontSize:27,fontWeight:850,opacity:show(f,85,23),transform:'scale('+(.78+.22*show(f,85,23))+')'}}>Ranking<br/>signals</div>
 {outputs.map((s,i)=><div key={s} style={{position:'absolute',top:75+i*174,left:720,padding:'21px 21px',width:248,border:'1px solid #6b8371',background:'#3d5240',borderRadius:12,fontSize:20,fontWeight:680,opacity:show(f,142+i*25,17),transform:'translateX('+(45*(1-show(f,142+i*25,17)))+'px)'}}>{s}</div>)}
 </div></Surface>};
const Backend:React.FC=()=>{const f=useCurrentFrame();const modules=[['01','SIGN IN','Account-based learning'],['02','STORE','Postgres + Drizzle'],['03','ENRICH','AI-powered context'],['04','REVIEW','Study and revisit']];return <Surface number="10" header="STACK / PRACTICAL ENGINEERING">
 <div style={{position:'absolute',left:112,top:195,width:670}}><div style={rise(f,0)}><Eyebrow>UNDER THE HOOD</Eyebrow></div><div style={{marginTop:28,...rise(f,15)}}><Title size={79}>More than<br/><span style={{color:C.sage}}>flashcards.</span></Title></div><div style={{marginTop:36,...rise(f,39)}}><Sub>Authentication, persistence, enrichment, and connected study workflows.</Sub></div></div>
 <div style={{position:'absolute',left:832,top:191,width:942,height:570,display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
 {modules.map(([n,t,d],i)=><div key={n} style={{background:C.white,border:'1px solid '+C.line,borderRadius:18,padding:33,boxShadow:'0 17px 45px #283b2d11',opacity:show(f,9+i*28,18),transform:'translateY('+(42*(1-show(f,9+i*28,18)))+'px)'}}><div style={{width:72,height:72,background:i%2?C.salmon:C.mint,borderRadius:14,color:i%2?C.terracotta:C.sage,fontSize:34,fontWeight:750,display:'grid',placeItems:'center'}}>{n}</div><div style={{fontSize:18,fontWeight:850,color:C.terracotta,letterSpacing:2,marginTop:32}}>{t}</div><div style={{fontSize:27,fontWeight:730,marginTop:12}}>{d}</div></div>)}
 </div></Surface>};
const Human:React.FC=()=>{const f=useCurrentFrame();return <Surface number="11" dark header="THE REASON / LEARNING">
 <div style={{position:'absolute',left:110,top:175,width:905}}><div style={rise(f,0)}><Eyebrow dark>A USEFUL REMINDER</Eyebrow></div><div style={{marginTop:29,...rise(f,11)}}><Title dark size={92}>AI can organize<br/><span style={{color:'#adcfaf'}}>information.</span></Title></div><div style={{marginTop:30,...rise(f,47,18)}}><Sub dark>But understanding still needs to happen in my own head.</Sub></div></div>
 <div style={{position:'absolute',left:1270,top:270,width:400,height:400,border:'1px solid #6a8a6f',borderRadius:'50%',opacity:show(f,18,28),transform:'scale('+(.8+.2*show(f,18,28))+')'}}>
 <div style={{position:'absolute',inset:50,border:'2px dashed #829d85',borderRadius:'50%',transform:'rotate('+(f*.9)+'deg)'}}/>
 <div style={{position:'absolute',inset:118,display:'grid',placeItems:'center',borderRadius:'50%',fontSize:136,fontWeight:750,color:C.paper}}>?</div></div>
 <div style={{position:'absolute',right:145,bottom:165,fontSize:21,fontWeight:780,letterSpacing:2.2,color:'#a8c5a9',opacity:show(f,72,18)}}>KEEP ASKING QUESTIONS</div>
 </Surface>};
const Closing:React.FC=()=>{const f=useCurrentFrame();return <Surface number="12">
 <div style={{position:'absolute',left:125,top:212}}><div style={rise(f,0,14)}><Eyebrow>NOT A STARTUP. NOT A PITCH.</Eyebrow></div><div style={{marginTop:29,...rise(f,14,19)}}><Title size={109}>Just curiosity,<br/><span style={{color:C.sage}}>turned into code.</span></Title></div><div style={{marginTop:28,...rise(f,61,16)}}><Sub>Wordbase — my personal learning experiment.</Sub></div><div style={{marginTop:66,...rise(f,86,15),fontSize:21,fontWeight:850,color:C.terracotta,letterSpacing:2.3}}>BUILT BY ABHIJEET SINGH SANDAL</div></div>
 <div style={{position:'absolute',right:155,top:580,background:C.mint,padding:'43px 61px',borderRadius:23,boxShadow:'0 16px 44px #354e4014',transform:'rotate('+(7*(1-show(f,14,28)))+'deg) scale('+(.86+.14*show(f,14,28))+')',opacity:show(f,10,20)}}><Brand large/></div>
 </Surface>};
const SCENES=[Opening,Scatter,Reveal,CardScreen,Deep,Notes,Quiz,Code,Recs,Backend,Human,Closing];
const GlobalTransitions:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{pointerEvents:'none'}}>{CUTS.slice(1,-1).map((c,i)=>{if(f<c-8||f>c+8)return null;const p=ease((f-(c-8))/16);const x=-2080+p*4160;const mirror=i%2===1;return <div key={c} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',overflow:'hidden'}}><div style={{position:'absolute',top:0,left:mirror?1920-x-2080:x,width:2080,height:1080,background:i%3===0?C.green:i%3===1?C.mint:C.salmon,boxShadow:'0 0 70px #26392625'}}/><div style={{position:'absolute',top:0,left:mirror?1920-x-2080:x,width:24,height:1080,background:C.terracotta}}/></div>})}</AbsoluteFill>};
export const WordbasePortfolioV2:React.FC=()=> <AbsoluteFill style={{background:C.paper}}>{SCENES.map((Scene,i)=><Sequence key={i} from={CUTS[i]} durationInFrames={CUTS[i+1]-CUTS[i]}><Scene/></Sequence>)}<GlobalTransitions/><Audio src={staticFile('wordbase/narration.mp3')}/></AbsoluteFill>;


/** Third cut: restore quiet space without slowing the speaker's actual delivery. */
const V3_PAUSES: ReadonlyArray<readonly [number,number]> = [[94,12],[147,24],[204,10],[258,12],[318,24],[377,12],[422,24],[520,10],[588,16],[768,24],[819,12],[900,24],[1051,24],[1251,24],[1497,24],[1564,16],[1616,16],[1655,24],[1705,12],[1760,24],[1802,12],[1840,16]];
const remapToOriginalFrame=(newFrame:number):{frame:number,holding:boolean}=>{
 let shift=0;
 for(const [originalFrame,addedFrames] of V3_PAUSES){
   const start=originalFrame+shift;
   if(newFrame<start)return {frame:newFrame-shift,holding:false};
   if(newFrame<start+addedFrames)return {frame:originalFrame,holding:true};
   shift+=addedFrames;
 }
 return {frame:newFrame-shift,holding:false};
};
const changedCut=(sourceCut:number)=>sourceCut+V3_PAUSES.reduce((n,[frame,added])=>n+(frame<=sourceCut?added:0),0);
const NEW_CUTS=CUTS.map(changedCut);
const V3Transitions:React.FC=()=>{
 const current=useCurrentFrame();
 return <AbsoluteFill style={{pointerEvents:'none'}}>
 {NEW_CUTS.slice(1,-1).map((cut,i)=>{
   const first=cut-3;
   const progress=(current-first)/15;
   if(progress<0||progress>1)return null;
   const x=interpolate(progress,[0,1],[-2050,2050]);
   return <div key={cut} style={{position:'absolute',left:0,top:0,width:1920,height:1080,overflow:'hidden'}}>
    <div style={{position:'absolute',left:x,top:0,width:2050,height:1080,background:i%3===0?C.green:i%3===1?C.mint:C.salmon,boxShadow:'0 0 50px #26392616'}}/>
    <div style={{position:'absolute',left:x,top:0,width:20,height:1080,background:C.terracotta}}/>
   </div>;
 })}
 </AbsoluteFill>;
};
/**
 * The audio file and visual retime share a 30fps pause manifest.
 * During an inserted silence, the current Wordbase visual genuinely holds.
 * Original scene frame coordinates remain unchanged; only the playback timeline expands.
 */
export const WordbasePortfolioV3:React.FC=()=>{
 const f=useCurrentFrame();
 const mapped=remapToOriginalFrame(f);
 const originalFrame=Math.min(1890,mapped.frame);
 const sceneIndex=Math.max(0,SCENES.findIndex((_,i)=>originalFrame>=CUTS[i] && originalFrame<CUTS[i+1]));
 const Scene=SCENES[sceneIndex];
 const sceneFrame=originalFrame-CUTS[sceneIndex];
 return <AbsoluteFill style={{background:C.paper}}>
  <Freeze frame={sceneFrame}><Scene/></Freeze>
  <V3Transitions/>
  <Audio src={staticFile('wordbase/narration-paced.mp3')}/>
 </AbsoluteFill>;
};
