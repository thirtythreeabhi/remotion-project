import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

const P = {espresso:'#24170F',dark:'#342216',mocha:'#6C4630',coffee:'#9B6845',latte:'#E7C5A0',cream:'#FBF7F1',linen:'#F1E7DA',white:'#FFFFFF',muted:'#806B5B',line:'#E6D5C5',mint:'#B4D7BB',gold:'#EDB478'};
const FILE=(s:string)=>staticFile('coffeemium/'+s);
const ease=(x:number)=>{const v=Math.max(0,Math.min(1,x));return v*v*(3-2*v);};
const enter=(f:number,t=0,n=18)=>ease((f-t)/n);
const lerp=(f:number,a:number,b:number,c:number,d:number)=>interpolate(f,[a,b],[c,d],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const fade=(f:number,at=0,n=20):React.CSSProperties=>({opacity:enter(f,at,n),transform:'translateY('+((1-enter(f,at,n))*42)+'px)'});
const bounds:React.CSSProperties={position:'absolute',inset:0,overflow:'hidden'};
const copy=(size:number,color=P.espresso,weight=700):React.CSSProperties=>({fontFamily:'Lato,Inter,Arial,sans-serif',fontSize:size,color,fontWeight:weight,lineHeight:1.08,letterSpacing:-1.4});
const shadows='0 35px 100px #26180D2B';
const Photo:React.FC<{file:string;style?:React.CSSProperties;fit?:'cover'|'contain'}>=({file,style,fit='cover'})=><Img src={FILE(file)} style={{width:'100%',height:'100%',objectFit:fit,...style}}/>;
const Pill:React.FC<{children:React.ReactNode,dark?:boolean}>=({children,dark})=><div style={{padding:'11px 23px',borderRadius:40,background:dark?P.espresso:'#F0E2D2',color:dark?'#FFF':P.mocha,fontSize:21,fontWeight:850,letterSpacing:.3}}>{children}</div>;
const Tag:React.FC<{children:React.ReactNode,color?:string}>=({children,color=P.mocha})=><div style={{fontWeight:900,letterSpacing:4,fontSize:18,color,textTransform:'uppercase'}}>{children}</div>;
const DotGrid:React.FC<{light?:boolean}>=({light})=><div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:light?.085:.05,backgroundImage:'radial-gradient(#513420 1.7px, transparent 1.7px)',backgroundSize:'28px 28px'}}/>;
const Scene:React.FC<{children:React.ReactNode,dark?:boolean,stamp?:string}>=({children,dark,stamp})=><AbsoluteFill style={{background:dark?P.espresso:P.cream,fontFamily:'Lato,Inter,Arial,sans-serif',overflow:'hidden'}}>
 <DotGrid light={dark}/>
 <div style={{position:'absolute',left:66,top:53,zIndex:30,display:'flex',alignItems:'center',gap:13,color:dark?P.cream:P.espresso}}>
   <div style={{height:37,width:37,borderRadius:'50%',background:dark?P.latte:P.mocha,display:'grid',placeItems:'center',fontWeight:900,color:dark?P.espresso:P.white,fontSize:19}}>C</div>
   <span style={{fontSize:24,fontWeight:900,letterSpacing:1.2}}>COFFEEMIUM</span>
 </div>
 {stamp&&<div style={{position:'absolute',right:70,top:62,color:dark?'#D1B49A':'#906B52',zIndex:30,fontWeight:850,letterSpacing:2.5,fontSize:17}}>{stamp.toUpperCase()}</div>}
 {children}
 <div style={{position:'absolute',bottom:48,left:69,right:70,zIndex:25,display:'flex',justifyContent:'space-between',color:dark?'#C6A58D':'#947D6C',fontSize:17,letterSpacing:2,fontWeight:850}}>
  <span>THE STOREFRONT EXPERIENCE</span><span>DEMO PROJECT  /  ABHIJEET</span>
 </div>
</AbsoluteFill>;
const Browser:React.FC<{children:React.ReactNode;style?:React.CSSProperties;url?:string}>=({children,style,url='coffeemium.shop / demo'})=><div style={{background:'#FFF',borderRadius:26,overflow:'hidden',border:'1px solid #D7C5B1',boxShadow:shadows,...style}}>
 <div style={{height:60,background:'#F3EAE2',borderBottom:'1px solid #E5DAD0',display:'flex',alignItems:'center',padding:'0 26px',gap:12}}>
  {['#D88A71','#E2BD70','#80AF8C'].map(c=><div key={c} style={{height:12,width:12,background:c,borderRadius:12}}/>)}
  <div style={{marginLeft:23,background:'#FFF',borderRadius:9,padding:'9px 19px',color:'#9C8E82',fontSize:15,width:390}}>{url}</div>
  <div style={{marginLeft:'auto',color:'#9A8D81',fontSize:15}}>⌕　◇　⋯</div>
 </div>
 <div style={{position:'relative',overflow:'hidden'}}>{children}</div>
 </div>;
const Product:React.FC<{file:string;name:string,sub:string,price:string;width?:number;selected?:boolean}>=({file,name,sub,price,width=300,selected})=><div style={{width,background:'#FFF',border:selected?'3px solid #A5704B':'1px solid #E6DBCF',borderRadius:20,overflow:'hidden',boxShadow:selected?'0 20px 48px #67402B32':'0 10px 32px #67402B18'}}>
 <div style={{height:width*.73,background:'#F3E6D9'}}><Photo file={file}/></div>
 <div style={{padding:'19px 22px 23px'}}><div style={{fontSize:13,color:P.coffee,letterSpacing:2,fontWeight:900}}>SINGLE ORIGIN</div><div style={{fontSize:25,fontWeight:900,marginTop:8,color:P.espresso}}>{name}</div><div style={{fontSize:16,color:P.muted,marginTop:6}}>{sub}</div><div style={{fontSize:22,fontWeight:900,marginTop:13,color:P.espresso}}>{price}</div></div>
</div>;
const Cursor:React.FC<{x:number,y:number,scale?:number}>=({x,y,scale=1})=><svg style={{position:'absolute',left:x,top:y,filter:'drop-shadow(2px 3px 2px #0005)',transform:'scale('+scale+')',transformOrigin:'top left',zIndex:21}} width="45" height="58" viewBox="0 0 45 58"><path d="M4 4 L4 47 L16 36 L25 55 L34 51 L24 33 L41 33 Z" fill="#1E1D1B" stroke="#fff" strokeWidth="3"/></svg>;
const Intro:React.FC=()=>{const f=useCurrentFrame();return <Scene dark stamp="A STORE THAT STANDS OUT">
 <div style={{position:'absolute',inset:0,opacity:.63}}><Photo file="coffeemium-hero.png" style={{transform:'scale('+lerp(f,0,108,1.03,1.13)+')',objectPosition:'center 57%'}}/></div>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#1C120DFC 0%,#1F140DE3 38%,#24170B34 82%)'}}/>
 <div style={{position:'absolute',left:122,top:270,width:1270}}>
  <div style={{...fade(f,2),color:P.latte,fontSize:23,fontWeight:850,letterSpacing:4}}>YOUR BRAND. YOUR STOREFRONT.</div>
  <div style={{...copy(116,P.white,950),...fade(f,8),marginTop:24}}>LOOK THIS GOOD.</div>
  <div style={{...copy(109,P.gold,950),...fade(f,30),marginTop:7}}>WORK EVEN BETTER.</div>
  <div style={{width:590,height:5,background:P.gold,marginTop:43,transformOrigin:'left',transform:'scaleX('+enter(f,37,45)+')'}}/>
 </div>
 <div style={{position:'absolute',right:100,top:172,width:420,height:420,border:'2px solid #FCE2B155',borderRadius:'50%',transform:'scale('+lerp(f,0,100,.65,1.15)+')',opacity:1-enter(f,72,35)}}/>
 </Scene>};
const Showcase:React.FC=()=>{const f=useCurrentFrame();return <Scene stamp="01 / STANDOUT DESIGN">
 <div style={{position:'absolute',top:143,left:113,width:600,...fade(f,1)}}><Tag>Introducing the demo</Tag><div style={{...copy(96),marginTop:28}}>Meet<br/><span style={{color:P.coffee}}>Coffeemium.</span></div><div style={{...copy(31,P.muted,450),lineHeight:1.32,marginTop:28,letterSpacing:-.5}}>An original, responsive e-commerce storefront built to feel like a real premium brand.</div><div style={{marginTop:33,display:'flex',gap:14}}><Pill>Custom design</Pill><Pill>Built with code</Pill></div></div>
 <div style={{position:'absolute',right:86,top:181,width:1048,transform:'perspective(2400px) rotateY('+lerp(f,0,210,-10,-1)+'deg) translateY('+lerp(f,0,210,60,0)+'px)',...{opacity:enter(f,3,25)}}}>
 <Browser>
  <div style={{height:604,background:P.cream,padding:29}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',color:P.espresso}}><span style={{fontSize:22,fontWeight:950}}>COFFEEMIUM</span><span style={{fontSize:17}}>Shop　Our Story　Bundles　⌕　♡　🛒</span></div>
   <div style={{display:'flex',gap:21,marginTop:35,height:487}}>
    <div style={{width:390,padding:'60px 8px 0 9px'}}><div style={{fontSize:16,color:P.coffee,fontWeight:900,letterSpacing:3}}>SPECIALTY COFFEE, YOUR WAY</div><div style={{fontSize:68,fontWeight:950,color:P.espresso,lineHeight:1.05,marginTop:24}}>Brew Better<br/>Mornings.</div><div style={{fontSize:20,color:P.muted,lineHeight:1.5,marginTop:21}}>Beautifully sourced coffees, thoughtfully roasted.</div><div style={{display:'inline-flex',borderRadius:40,background:P.espresso,padding:'17px 28px',color:'#FFF',fontWeight:800,marginTop:29,fontSize:18}}>Explore Coffees ↗</div></div>
    <div style={{flex:1,borderRadius:20,overflow:'hidden',background:P.linen}}><Photo file="coffeemium-hero.png"/></div>
   </div>
  </div>
 </Browser></div>
 <div style={{position:'absolute',right:120,bottom:116,opacity:enter(f,80,23)}}><Pill dark>RESPONSIVE STOREFRONT ↗</Pill></div>
 </Scene>};
const Catalog:React.FC=()=>{const f=useCurrentFrame();const p=[['coorg-arabica.946Z.png','Coorg Arabica','Smooth + balanced','₹449'],['house-espresso.360Z.png','House Espresso','Full bodied','₹499'],['ethiopian-yirgacheffe.357Z.png','Ethiopian Yirgacheffe','Floral + bright','₹599']];
 return <Scene stamp="02 / PRODUCT DISCOVERY">
 <div style={{position:'absolute',left:105,top:147,...fade(f,2)}}><Tag>Built for shoppers</Tag><div style={{...copy(82),marginTop:20}}>Explore. Discover.<br/><span style={{color:P.coffee}}>Fall in love.</span></div><div style={{...copy(28,P.muted,450),marginTop:22}}>A catalog that makes every product shine.</div></div>
 <div style={{position:'absolute',left:85,top:455,display:'flex',gap:26}}>
  {p.map((it,i)=><div key={it[1]} style={{...fade(f,18+i*16,18),transform:'translateY('+((1-enter(f,18+i*16,18))*58 - (i===1?12:0))+'px)'}}><Product file={it[0]} name={it[1]} sub={it[2]} price={it[3]} width={387} selected={i===1&&f>98}/></div>)}
 </div>
 <div style={{position:'absolute',right:113,top:200,width:430,padding:33,background:'#EEE0D0',borderRadius:26,opacity:enter(f,73,21),transform:'rotate(4deg)'}}>
 <div style={{fontSize:23,fontWeight:850,color:P.mocha}}>BUILT FOR CONVERSION</div><div style={{fontSize:29,lineHeight:1.3,marginTop:19,color:P.espresso,fontWeight:700}}>Searchable collections.<br/>Filterable products.<br/>Detailed item pages.</div>
 </div>
 {f>87&&<Cursor x={875+lerp(f,90,125,0,100)} y={760+lerp(f,90,125,100,-68)}/>}
 </Scene>};
const Finder:React.FC=()=>{const f=useCurrentFrame();const selected=f>85;const choice=(label:string,val:string,i:number)=> <div style={{background:'#FFF',border:'1px solid #DCCBBA',padding:'24px 20px',borderRadius:14,width:278}}><div style={{fontSize:19,color:P.muted,marginBottom:14,fontWeight:700}}>{label}</div><div style={{display:'flex',justifyContent:'space-between',color:P.espresso,fontWeight:850,fontSize:26}}>{val}<span style={{color:P.coffee}}>⌄</span></div><div style={{marginTop:15,height:4,background:i===0?'#A26F4C':i===1?'#D6B398':'#6E4631',width:selected?'100%':'25%',transition:'none'}}/></div>;
return <Scene stamp="03 / SMART INTERACTIONS">
 <div style={{position:'absolute',left:110,top:150,...fade(f)}}><Tag>A little intelligence</Tag><div style={{...copy(91),marginTop:23}}>Find your<br/><span style={{color:P.coffee}}>perfect match.</span></div><div style={{...copy(28,P.muted,450),marginTop:27,lineHeight:1.3,width:580}}>Interactive recommendations based on flavor, brewing method, and preferred strength.</div></div>
 <div style={{position:'absolute',left:780,top:182,width:1058,...fade(f,10),background:P.linen,border:'1px solid #DBC7B3',borderRadius:29,padding:42,boxShadow:shadows}}>
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{...copy(42)}}>Find Your Perfect Coffee</div><Pill>COFFEE FINDER</Pill></div>
  <div style={{marginTop:33,fontSize:21,color:P.muted}}>Choose what you love. We'll find a match.</div>
  <div style={{display:'flex',gap:18,marginTop:36}}>{choice('Flavor',selected?'Chocolate':'Surprise me',0)}{choice('Brewer',selected?'Espresso':'Any brewer',1)}{choice('Strength',selected?'Dark':'Any strength',2)}</div>
  <div style={{marginTop:35,background:P.espresso,color:'#FFF',fontWeight:850,textAlign:'center',fontSize:23,padding:'22px',borderRadius:40,transform:'scale('+ (f>111&&f<120?.97:1)+')'}}>Show my matches ↗</div>
  <div style={{marginTop:30,height:176,background:'#FFF',borderRadius:18,display:'flex',alignItems:'center',gap:24,padding:20,opacity:enter(f,124,18)}}>
   <div style={{width:184,height:137,borderRadius:13,overflow:'hidden'}}><Photo file="house-espresso.360Z.png"/></div>
   <div><Tag color={P.coffee}>Your catalog match</Tag><div style={{...copy(34),marginTop:12}}>House Espresso</div><div style={{fontSize:21,color:P.muted,marginTop:12}}>Chocolate notes · Dark roast · Espresso</div></div>
  </div>
 </div>
 <div style={{position:'absolute',left:120,top:792,...fade(f,74)}}><Pill dark>PERSONALIZED SHOPPING, NO GUESSWORK</Pill></div>
 <Cursor x={1460+lerp(f,40,115,0,-185)} y={535+lerp(f,40,115,0,95)}/>
 </Scene>};
const Details:React.FC=()=>{const f=useCurrentFrame();const active=f>80?2:f>43?1:0;return <Scene stamp="04 / DETAILED COMMERCE FLOW">
 <div style={{position:'absolute',left:100,top:139,...fade(f,1)}}><Tag>Make it yours</Tag><div style={{...copy(86),marginTop:21}}>Every detail.<br/><span style={{color:P.coffee}}>Thoughtfully built.</span></div></div>
 <div style={{position:'absolute',left:90,top:424,width:695,height:488,borderRadius:29,overflow:'hidden',boxShadow:shadows,...fade(f,6)}}><Photo file="coorg-arabica.946Z.png"/></div>
 <div style={{position:'absolute',left:840,top:365,width:965,padding:49,background:'#FFF',borderRadius:28,border:'1px solid #E4D4C4',boxShadow:shadows,...fade(f,17)}}>
  <Tag>Customize your coffee</Tag><div style={{...copy(55),marginTop:17}}>Coorg Arabica</div><div style={{fontSize:24,color:P.muted,marginTop:14}}>Smooth and balanced · Single origin</div>
  <div style={{marginTop:30,fontSize:23,fontWeight:850}}>Roast profile</div>
  <div style={{display:'flex',gap:14,marginTop:13}}>{['Light','Medium','Dark'].map((s,i)=><div key={s} style={{fontSize:22,border:'2px solid '+(active===i?P.mocha:P.line),background:active===i?P.espresso:'#FBF9F6',color:active===i?'#FFF':P.espresso,borderRadius:13,padding:'18px 34px',fontWeight:850}}>{s}</div>)}</div>
  <div style={{marginTop:28,fontSize:23,fontWeight:850}}>Grind and pack size</div>
  <div style={{display:'flex',gap:14,marginTop:13}}><Pill>Espresso grind</Pill><Pill>250 g</Pill><Pill>Quantity: 1</Pill></div>
  <div style={{marginTop:30,display:'flex',gap:33,alignItems:'center'}}><div style={{...copy(42)}}>₹449</div><div style={{background:P.espresso,color:'#FFF',borderRadius:40,padding:'17px 51px',fontSize:24,fontWeight:850}}>Add to cart ↗</div></div>
 </div>
 <Cursor x={1170+lerp(f,20,105,0,225)} y={692}/>
 </Scene>};
const Bundles:React.FC=()=>{const f=useCurrentFrame();return <Scene stamp="05 / CART + BUNDLES">
 <div style={{position:'absolute',left:106,top:158,...fade(f)}}><Tag>More than a catalog</Tag><div style={{...copy(93),marginTop:21}}>Build the<br/><span style={{color:P.coffee}}>entire journey.</span></div><div style={{...copy(27,P.muted,450),marginTop:30}}>Curated bundles, a synced cart,<br/>and a test-mode checkout flow.</div></div>
 <div style={{position:'absolute',right:111,top:187,width:1000,height:685,display:'flex',gap:21,...fade(f,12)}}>
  <div style={{flex:1,background:'#FFF',borderRadius:28,padding:19,boxShadow:shadows,transform:'rotate(-2deg)'}}>
   <div style={{height:334,display:'flex',gap:10}}>{['chikmangalur-peaberry.913Z.png','balanced-medium.879Z.png'].map(s=><div key={s} style={{flex:1,overflow:'hidden',borderRadius:14}}><Photo file={s}/></div>)}</div>
   <div style={{padding:22}}><Tag>Explore and save</Tag><div style={{...copy(37),marginTop:11}}>Curated Coffee Bundle</div><div style={{fontSize:21,color:P.muted,marginTop:12}}>Two favorites. One better price.</div><div style={{background:P.espresso,borderRadius:40,padding:19,textAlign:'center',color:'#FFF',marginTop:29,fontWeight:900,fontSize:20}}>Add entire bundle +</div></div>
  </div>
  <div style={{width:420,background:P.linen,borderRadius:28,padding:28,boxShadow:shadows,transform:'rotate(2deg)',opacity:enter(f,32,15)}}>
   <div style={{...copy(36)}}>Your cart　🛒</div><div style={{fontSize:17,color:P.muted,marginTop:12}}>2 items, ready for checkout</div>
   {['House Espresso','Coorg Arabica'].map((it,i)=><div key={it} style={{marginTop:25,borderBottom:'1px solid #DCC9B8',paddingBottom:18,display:'flex',justifyContent:'space-between',fontSize:19,fontWeight:800}}><span>{it}</span><span>₹{i?449:499}</span></div>)}
   <div style={{marginTop:28,fontSize:25,fontWeight:850,display:'flex',justifyContent:'space-between'}}><span>Total</span><span>₹948</span></div>
   <div style={{marginTop:27,padding:18,borderRadius:40,background:P.espresso,textAlign:'center',color:'#FFF',fontWeight:900}}>Demo checkout ↗</div>
   <div style={{marginTop:18,textAlign:'center',color:P.muted,fontSize:15}}>TEST MODE · NO REAL PAYMENT</div>
  </div>
 </div>
 </Scene>};
const Admin:React.FC=()=>{const f=useCurrentFrame();return <Scene stamp="06 / BEHIND THE SCENES">
 <div style={{position:'absolute',left:110,top:146,...fade(f)}}><Tag>Built beyond the pretty screens</Tag><div style={{...copy(86),marginTop:23}}>Full-stack<br/><span style={{color:P.coffee}}>thinking.</span></div><div style={{...copy(27,P.muted,450),marginTop:22,lineHeight:1.3,width:525}}>Product administration, database-backed catalog, authentication, and a browser-local customization demo.</div>
 <div style={{display:'flex',gap:11,marginTop:30,flexWrap:'wrap',width:560}}>{['NEXT.JS','REACT','TYPESCRIPT','PRISMA','POSTGRESQL'].map((s,i)=><div key={s} style={{opacity:enter(f,45+i*10,13)}}><Pill>{s}</Pill></div>)}</div></div>
 <div style={{position:'absolute',right:92,top:170,width:1080,...fade(f,15),transform:'perspective(2000px) rotateY('+lerp(f,0,205,7,0)+'deg)'}}>
 <Browser url="coffeemium / admin / products">
  <div style={{height:630,background:'#FAF8F5',display:'flex'}}>
   <div style={{width:225,background:P.espresso,padding:'31px 24px',color:'#FFF'}}><div style={{fontSize:22,fontWeight:950}}>COFFEEMIUM</div>{['Overview','Products','Categories','Orders','Settings'].map((s,i)=><div key={s} style={{marginTop:33,fontSize:20,color:i===1?'#FFDFBC':'#C8A993',fontWeight:i===1?900:600}}>{i===1?'▸ ':''}{s}</div>)}</div>
   <div style={{flex:1,padding:34}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{...copy(40)}}>Product Management</div><div style={{padding:'15px 18px',borderRadius:10,background:P.espresso,color:'#FFF',fontWeight:850}}>+ Add product</div></div><div style={{fontSize:17,color:P.muted,marginTop:10}}>Manage your storefront catalog</div>
   <div style={{marginTop:26,display:'flex',gap:11}}>{['Search products...','Category: All','Status: Active'].map((s,i)=><div key={s} style={{padding:'15px 17px',border:'1px solid #DFD4C9',background:'#FFF',borderRadius:12,color:P.muted,fontSize:17}}>{s}</div>)}</div>
   <div style={{marginTop:28,background:'#FFF',border:'1px solid #E7D9CA',borderRadius:15,overflow:'hidden'}}>{[['Coorg Arabica','₹449','Published'],['House Espresso','₹499','Published'],['Ethiopian Yirgacheffe','₹599','Published'],['Balanced Medium','₹469','Published']].map((row,i)=><div key={i} style={{height:83,padding:'20px 24px',display:'flex',alignItems:'center',borderBottom:'1px solid #F1E9E0',gap:10,opacity:enter(f,63+i*14,14)}}><div style={{width:35,height:35,background:'#DCC3A9',borderRadius:8}}/><div style={{fontSize:20,fontWeight:850,width:350}}>{row[0]}</div><div style={{fontSize:20,width:100}}>{row[1]}</div><div style={{fontSize:17,background:'#E6F4E5',color:'#347147',borderRadius:20,padding:'9px 14px'}}>{row[2]}</div></div>)}</div>
   </div>
  </div>
 </Browser>
 </div>
 </Scene>};
const Personal:React.FC=()=>{const f=useCurrentFrame();return <Scene dark stamp="NOT A REAL COFFEE COMPANY">
 <div style={{position:'absolute',width:790,height:790,right:-185,top:75,borderRadius:'50%',background:'radial-gradient(circle,#8153398A,transparent 69%)',transform:'scale('+lerp(f,0,129,.8,1.15)+')'}}/>
 <div style={{position:'absolute',left:115,top:227,...fade(f)}}><Tag color={P.latte}>The possibilities are yours</Tag><div style={{...copy(99,P.white,950),marginTop:26}}>This is a demo.<br/><span style={{color:P.gold}}>Your brand is next.</span></div><div style={{...copy(34,'#D6B9A1',500),marginTop:35,lineHeight:1.36,letterSpacing:0}}>Your products. Your identity.<br/>Your custom customer experience.</div></div>
 <div style={{position:'absolute',right:168,top:248,width:360,height:360,borderRadius:35,background:'#E2C4A4',boxShadow:'0 23px 83px #0007',display:'grid',placeItems:'center',transform:'rotate('+lerp(f,0,126,12,-3)+'deg)'}}><div style={{fontSize:240,color:P.espresso,fontWeight:950}}>A.</div></div>
 </Scene>};
const Outro:React.FC=()=>{const f=useCurrentFrame();return <Scene dark stamp="LET'S BUILD YOUR NEXT PROJECT">
 <div style={{position:'absolute',top:140,left:92,right:92,bottom:130,border:'1px solid #76523C',borderRadius:34,background:'radial-gradient(circle at 80% 50%,#68422E 0%,#2A1A12 52%,#20130E 100%)'}}/>
 <div style={{position:'absolute',left:156,top:227,...fade(f,2)}}><Tag color={P.gold}>CUSTOM E-COMMERCE DEVELOPMENT</Tag><div style={{...copy(100,P.white,950),marginTop:28}}>Have a project<br/><span style={{color:P.gold}}>in mind?</span></div><div style={{...copy(36,'#D7BAA5',550),marginTop:28}}>Let's build something worth showing off.</div><div style={{marginTop:50,display:'flex',gap:16,alignItems:'center'}}><div style={{borderRadius:40,padding:'20px 35px',background:P.gold,color:P.espresso,fontSize:29,fontWeight:950}}>WORK WITH ABHIJEET ↗</div><span style={{fontSize:24,color:'#BE9E88'}}>Available for custom builds</span></div></div>
 <div style={{position:'absolute',right:202,top:322,width:380,height:380,background:'#E9D4BA',borderRadius:45,display:'grid',placeItems:'center',transform:'rotate(-6deg) scale('+lerp(f,0,100,.8,1)+')',boxShadow:'0 20px 65px #0006'}}><div style={{fontSize:260,fontWeight:950,color:P.espresso}}>A.</div></div>
 </Scene>};

const cuts=[0,109,326,533,722,908,1041,1246,1375,1480];
const scenes=[Intro,Showcase,Catalog,Finder,Details,Bundles,Admin,Personal,Outro];
export const CoffeemiumFiverr:React.FC=()=> <AbsoluteFill style={{background:P.espresso}}>{scenes.map((S,i)=><Sequence key={i} from={cuts[i]} durationInFrames={cuts[i+1]-cuts[i]}><S/></Sequence>)}<Audio src={FILE('narration.mp3')} volume={1}/></AbsoluteFill>;
