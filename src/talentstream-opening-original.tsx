import React from 'react';
import {AbsoluteFill,Audio,interpolate,spring,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';

const colors={dark:'#080F19',orange:'#FF6B00',white:'#F6F8FC',muted:'#A6B1C0'};
const names=['Aisha','Rahul','Maya','Neha','Kabir','Arjun','Priya','Tara','Dev','Aman','Riya','Diya','Isha','Nina','Raj','Zara'];
const clamp=(n:number)=>Math.min(1,Math.max(0,n));
export const TalentStreamOpening:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const progress=clamp((frame-75)/100);
 const count=interpolate(frame,[0,25,55],[0,84,200],{extrapolateRight:'clamp'});
 const visible=clamp(frame/20);
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 75% 50%,#16263C,#0A101A 65%)',color:colors.white,overflow:'hidden',fontFamily:'Lato,Arial,sans-serif'}}>
  <Audio src={staticFile('narration.mp3')} volume={1}/>
  <Audio src={staticFile('instrumental.wav')} volume={0.13}/>
  <div style={{position:'absolute',left:104,top:72,display:'flex',alignItems:'center',gap:16}}>
   <span style={{width:43,height:43,borderRadius:10,background:colors.orange,display:'flex',alignItems:'center',justifyContent:'center',fontSize:21,fontWeight:900}}>TS</span>
   <span style={{fontSize:30,fontWeight:900}}>TalentStream <span style={{color:colors.orange}}>AI</span></span>
  </div>
  <div style={{position:'absolute',left:100,top:260,opacity:visible,width:790,transform:'translateY('+((1-visible)*30)+'px)'}}>
   <div style={{fontSize:23,fontWeight:900,color:'#FFAF75',letterSpacing:6}}>HIRING, REIMAGINED</div>
   <div style={{display:'flex',alignItems:'baseline',gap:26,marginTop:22}}>
    <span style={{fontSize:181,fontWeight:900,letterSpacing:-12}}>{Math.round(count)}</span>
    <span style={{fontSize:58,color:colors.orange,fontWeight:900}}>RESUMES</span>
   </div>
   <div style={{fontSize:42,color:colors.muted,marginTop:10,lineHeight:1.27,opacity:1-clamp((frame-107)/17)}}>Countless details.<br/>One hiring decision.</div>
   <div style={{position:'absolute',top:268,fontSize:54,fontWeight:900,opacity:clamp((frame-107)/17)}}>From noise to <span style={{color:'#FF9D59'}}>clarity.</span></div>
   <div style={{display:'flex',gap:12,marginTop:65,opacity:clamp((frame-165)/26)}}>
    {['EVIDENCE-FIRST','HUMAN-LED'].map((s,i)=><div key={s} style={{border:'1px solid '+(i?'#485365':colors.orange),color:i?'#B9C6D6':'#FFB17A',borderRadius:28,padding:'12px 20px',letterSpacing:2,fontSize:19,fontWeight:900}}>{s}</div>)}
   </div>
  </div>
  {[200,320,450,580].map((radius,i)=><div key={radius} style={{position:'absolute',width:radius,height:radius,left:1360,top:535,borderRadius:'50%',border:'1.5px solid #FF6B002C',transform:'translate(-50%,-50%) rotate('+((frame*.34)+(i*38))+'deg)'}}/>)}
  {names.map((n,i)=>{
   const angle=i*2.39996323;
   const x=1330+Math.cos(angle)*(430+27*(i%4));
   const y=530+Math.sin(angle)*(310+24*(i%3));
   const converged=spring({frame:frame-62-i*1.5,fps,config:{stiffness:48,damping:19,mass:1.4}});
   const xx=x+(1360-x)*.64*converged,yy=y+(535-y)*.64*converged;
   const opacity=clamp((frame-i*1.3)/20)*(1-.95*clamp((frame-225-i)/45));
   return <div key={i} style={{position:'absolute',left:xx,top:yy,transform:'translate(-50%,-50%) scale('+(.9-.15*converged)+')',width:166,height:74,borderRadius:14,background:i%7===0?'#C85620':'#273449',boxShadow:'0 16px 35px #0005',opacity,display:'flex',gap:14,alignItems:'center',padding:13,boxSizing:'border-box'}}>
    <div style={{width:29,height:29,borderRadius:18,background:'#FFFFFF44',display:'grid',placeItems:'center',fontWeight:900}}>{n[0]}</div>
    <div style={{display:'grid',gap:8}}><div style={{height:5,width:62,borderRadius:4,background:'#EAEDF3'}}/><div style={{height:5,width:43,borderRadius:4,background:'#AAB5C6'}}/></div>
   </div>;
  })}
  <div style={{position:'absolute',left:1360,top:535,width:194,height:194,borderRadius:42,background:colors.orange,transform:'translate(-50%,-50%) scale('+(0.7+0.3*progress)+')',opacity:clamp((frame-65)/20),display:'grid',placeItems:'center',boxShadow:'0 0 120px #F76B004E',fontSize:94,fontWeight:900}}>AI</div>
  <div style={{position:'absolute',bottom:50,left:100,right:100,height:3,background:'#FFFFFF25'}}>
   <div style={{width:(frame/300*100)+'%',height:3,background:colors.orange}}/></div>
 </AbsoluteFill>;
};
export const TalentStreamV4:React.FC=()=> <AbsoluteFill style={{background:colors.dark,color:colors.white,fontFamily:'Lato,Arial,sans-serif',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
 <Audio src={staticFile('narration.mp3')}/>
 <div style={{fontSize:95,fontWeight:900}}>TalentStream <span style={{color:colors.orange}}>AI</span></div>
 <div style={{fontSize:27,letterSpacing:5,opacity:0.55,marginTop:25}}>FULL FILM STORYBOARD — IN DEVELOPMENT</div>
 </AbsoluteFill>;
