import React, { useMemo } from 'react';
import { WorkoutState, ActivityStatus, LightPhase } from '../types';

interface GlowMTileProps {
  state: WorkoutState;
}

export const GlowMTile: React.FC<GlowMTileProps> = ({ state }) => {
  
  const percentage = Math.min(100, (state.count / state.target) * 100);
  
  // Logic from patent: Map accumulation to color coordinates
  const colorState = useMemo(() => {
    if (percentage < 33) return { 
        phase: LightPhase.PHASE_1, 
        color: '#ef4444', // Red-500
        glow: 'rgba(239, 68, 68, 0.6)' 
    };
    if (percentage < 66) return { 
        phase: LightPhase.PHASE_2, 
        color: '#eab308', // Yellow-500
        glow: 'rgba(234, 179, 8, 0.6)' 
    };
    return { 
        phase: LightPhase.PHASE_3, 
        color: '#10b981', // Emerald-500
        glow: 'rgba(16, 185, 129, 0.8)' 
    };
  }, [percentage]);

  const isIdle = state.status === ActivityStatus.IDLE;
  
  // Patent claim: "Hidden matrix display that transmits information only when active"
  // Implemented via opacity transition
  const displayOpacity = isIdle ? 0 : 1;

  // Hexagon Path for SVG
  // Size 400x400
  const hexPath = "M200 10 L373.2 110 L373.2 310 L200 410 L26.8 310 L26.8 110 Z";

  return (
    <div className="relative w-[400px] h-[420px] flex items-center justify-center drop-shadow-2xl">
      
      {/* Patent Claim: "Housing with optical panel" */}
      <svg width="400" height="420" viewBox="0 0 400 420" className="transition-all duration-500">
        <defs>
            {/* Patent Claim: "Half-matte cover layer" simulation */}
            <filter id="matte-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
            </filter>
            
            {/* Patent Claim: "Edge Light Module" glow effect */}
            <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur" />
                <feFlood floodColor={colorState.color} result="color" />
                <feComposite in="color" in2="blur" operator="in" result="shadow" />
                <feMerge>
                    <feMergeNode in="shadow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* The Base Housing (Dark) */}
        <path 
            d={hexPath} 
            fill="#171717" 
            stroke="#262626" 
            strokeWidth="2"
        />

        {/* The Edge Light Ring (Patent Claim 1) */}
        <path 
            d={hexPath} 
            fill="none" 
            stroke={isIdle ? '#333' : colorState.color}
            strokeWidth={isIdle ? 2 : 8}
            strokeLinecap="round"
            style={{
                transition: 'stroke 0.5s ease, stroke-width 0.3s ease',
                filter: isIdle ? 'none' : 'url(#edge-glow)'
            }}
            className="drop-shadow-lg"
        />
        
        {/* Fill animation for progress (Optional visual flair) */}
        {!isIdle && (
             <path 
             d={hexPath} 
             fill={colorState.color}
             fillOpacity="0.05"
             stroke="none"
             transform={`scale(${0.8 + (percentage / 500)})`}
             transform-origin="center"
         />
        )}
      </svg>

      {/* Patent Claim: "Hidden Matrix Display" */}
      {/* Positioned absolutely over the SVG */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-700"
        style={{ opacity: displayOpacity }}
      >
        <div className="relative z-10">
            <h3 className="text-gray-400 text-sm tracking-[0.2em] font-medium mb-2 uppercase">Target: {state.target}</h3>
            
            {/* The Matrix Display Digits */}
            <div 
                className="text-9xl font-display font-bold tabular-nums text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ 
                    textShadow: `0 0 20px ${colorState.color}` 
                }}
            >
                {state.count}
            </div>

            {/* Patent Effect: "Masking layer" visual noise/grid pattern */}
            <div className="w-full h-1 bg-gray-800 rounded-full mt-6 overflow-hidden relative">
                <div 
                    className="h-full transition-all duration-300 ease-out"
                    style={{ 
                        width: `${percentage}%`,
                        backgroundColor: colorState.color,
                        boxShadow: `0 0 10px ${colorState.color}`
                    }}
                />
            </div>
            
            {state.count >= state.target && (
                <div className="mt-4 text-emerald-400 font-bold animate-pulse tracking-widest uppercase text-sm">
                    Goal Reached
                </div>
            )}
        </div>
      </div>

      {/* Surface Texture Overlay (Patent: Half-matte cover) */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
        style={{ 
            clipPath: 'polygon(50% 2.5%, 93.3% 26.2%, 93.3% 73.8%, 50% 97.5%, 6.7% 73.8%, 6.7% 26.2%)',
            width: '400px',
            height: '420px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
};