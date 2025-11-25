import React, { useState, useEffect, useRef } from 'react';
import { SmartWatch } from './components/SmartWatch';
import { GlowMTile } from './components/GlowMTile';
import { ActivityStatus, WorkoutState } from './types';
import { INITIAL_STATE, CALORIES_PER_REP } from './constants';
import { Settings, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>(INITIAL_STATE);
  const timerRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (workoutState.status === ActivityStatus.ACTIVE) {
      timerRef.current = window.setInterval(() => {
        setWorkoutState(prev => ({
          ...prev,
          duration: prev.duration + 1,
          heartRate: Math.min(160, Math.max(80, prev.heartRate + (Math.random() * 4 - 2))) // Fluctuate HR
        }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (workoutState.status === ActivityStatus.IDLE) {
          setWorkoutState(prev => ({ ...prev, heartRate: 72 }));
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workoutState.status]);

  const handleAction = (action: 'START' | 'PAUSE' | 'RESET' | 'INCREMENT') => {
    switch (action) {
      case 'START':
        setWorkoutState(prev => ({ ...prev, status: ActivityStatus.ACTIVE }));
        break;
      case 'PAUSE':
        setWorkoutState(prev => ({ ...prev, status: ActivityStatus.PAUSED }));
        break;
      case 'RESET':
        setWorkoutState(INITIAL_STATE);
        break;
      case 'INCREMENT':
        setWorkoutState(prev => {
           const newCount = prev.count + 1;
           // If goal reached, maybe flash or celebrate?
           // For now just update count
           return {
             ...prev,
             count: newCount,
             calories: prev.calories + CALORIES_PER_REP,
             heartRate: Math.min(170, prev.heartRate + 2) // Spike HR on exertion
           };
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                <Zap className="text-white fill-current" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">GLOW-M <span className="text-emerald-500">SYNC</span></h1>
                <p className="text-xs text-slate-400">Patent No. KR-10-202X-XXXXXXX</p>
            </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={24} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 relative">
        
        {/* Background Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Section 1: The Wearable (Controller) */}
        <div className="flex flex-col items-center gap-6 z-10">
            <div className="text-center space-y-2 mb-4">
                <h2 className="text-lg font-semibold text-slate-200">Wearable Controller</h2>
                <p className="text-sm text-slate-400 max-w-[250px]">
                    Simulates your Smart Watch app detecting motion gestures.
                </p>
            </div>
            <SmartWatch state={workoutState} onAction={handleAction} />
            <div className="text-xs text-slate-600 font-mono">
                BLE Connection: STABLE (-42dBm)
            </div>
        </div>

        {/* Connection Visual (Desktop Only) */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-2 opacity-50">
            <div className="w-32 h-[2px] bg-gradient-to-r from-slate-700 via-emerald-500 to-slate-700 animate-pulse" />
            <span className="text-[10px] tracking-widest text-emerald-500 uppercase">Mesh Network Active</span>
            <div className="w-32 h-[2px] bg-gradient-to-r from-slate-700 via-emerald-500 to-slate-700 animate-pulse" />
        </div>

        {/* Section 2: The Wall Tile (GLOW-M) */}
        <div className="flex flex-col items-center gap-6 z-10">
            <div className="text-center space-y-2 mb-4">
                <h2 className="text-lg font-semibold text-slate-200">GLOW-M Wall Tile</h2>
                <p className="text-sm text-slate-400 max-w-[300px]">
                    Patent-pending hidden display with edge-lighting feedback system.
                </p>
            </div>
            <GlowMTile state={workoutState} />
            <div className="text-xs text-slate-600 font-mono text-center">
                Module ID: #HEX-09-A<br/>
                Optical Layer: Active
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;