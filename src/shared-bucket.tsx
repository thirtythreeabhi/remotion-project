import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const SharedBucket: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, 110], [232, 171], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
  });
  return (
    <div style={{position:'relative', width:325, height:350}}>
      <svg width="325" height="350" viewBox="0 0 325 350">
        <defs>
          <linearGradient id="shell" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#3d7898"/><stop offset="1" stopColor="#101b33"/>
          </linearGradient>
          <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#7beaf5"/><stop offset="1" stopColor="#227dbf"/>
          </linearGradient>
          <clipPath id="interior"><path d="M65 94 L260 94 L237 301 Q163 328 87 301 Z"/></clipPath>
        </defs>
        <path d="M65 94 L260 94 L237 301 Q163 328 87 301 Z" fill="url(#shell)" stroke="#91d6ed" strokeWidth="5"/>
        <g clipPath="url(#interior)">
          <rect x="55" y={fill} width="220" height="200" fill="url(#water)" opacity=".83"/>
          <ellipse cx="163" cy={fill} rx="115" ry="11" fill="#b0f6ff" opacity=".58"/>
        </g>
        <ellipse cx="162" cy="94" rx="100" ry="19" fill="#101a2a" stroke="#91d6ed" strokeWidth="5"/>
        <path d="M96 89 Q96 9 162 9 Q229 9 229 89" fill="none" stroke="#91d6ed" strokeWidth="9"/>
      </svg>
      <div style={{position:'absolute',top:182,left:65,right:65,textAlign:'center',fontFamily:'Inter, Arial, sans-serif',textShadow:'0 2px 10px #071321'}}>
        <div style={{fontSize:16,color:'#e2faff',fontWeight:800,letterSpacing:2}}>SHARED</div>
        <div style={{fontSize:27,color:'#ffffff',fontWeight:900}}>ALLOWANCE</div>
      </div>
    </div>
  );
};
