import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Activity, Heart, Flame, Watch } from 'lucide-react';
import { ActivityStatus, WorkoutState } from '../types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SmartWatchProps {
  state: WorkoutState;
  onAction: (action: 'START' | 'PAUSE' | 'RESET' | 'INCREMENT') => void;
}

const MOCK_SENSOR_DATA = Array(20).fill(0).map(() => ({ val: 0 }));

export const SmartWatch: React.FC<SmartWatchProps> = ({ state, onAction }) => {
  const [sensorData, setSensorData] = useState(MOCK_SENSOR_DATA);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate accelerometer noise
  useEffect(() => {
    if (state.status !== ActivityStatus.ACTIVE) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        const newData = [...prev.slice(1), { val: Math.random() * 20 - 10 }];
        return newData;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [state.status]);

  const handleSimulateMotion = useCallback(() => {
    if (state.status !== ActivityStatus.ACTIVE) return;
    
    setIsAnimating(true);
    // Spike the graph
    setSensorData(prev => {
        const spike = [...prev.slice(5), {val: 50}, {val: -40}, {val: 20}, {val: 0}, {val: 0}];
        return spike;
    });

    onAction('INCREMENT');
    setTimeout(() => setIsAnimating(false), 300);
  }, [state.status, onAction]);

  return (
    <div className="relative w-[320px] h-[380px] bg-gray-900 rounded-[48px] border-[8px] border-gray-700 shadow-2xl flex flex-col overflow-hidden ring-4 ring-black">
        {/* Watch Crown */}
        <div className="absolute -right-[12px] top-16 w-3 h-12 bg-gray-600 rounded-r-md border-l border-gray-800" />
        <div className="absolute -right-[12px] top-32 w-3 h-8 bg-gray-600 rounded-r-md border-l border-gray-800" />

        {/* Screen Content */}
        <div className="flex-1 bg-black p-4 flex flex-col justify-between relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center text-gray-400 text-xs font-medium">
                <span>10:09</span>
                <div className="flex items-center gap-1 text-green-500">
                    <Watch size={12} />
                    <span>CONNECTED</span>
                </div>
            </div>

            {/* Main Metric */}
            <div className="flex flex-col items-center justify-center space-y-2 z-10">
                <div className={`text-6xl font-display font-bold tabular-nums transition-transform duration-100 ${isAnimating ? 'scale-110 text-white' : 'text-gray-100'}`}>
                    {state.count}
                </div>
                <div className="text-sm text-yellow-500 font-medium uppercase tracking-wider">Squats</div>
            </div>

            {/* Sub Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-gray-900/50 rounded-xl p-2 flex flex-col items-center border border-gray-800">
                    <Heart size={16} className="text-red-500 mb-1" />
                    <span className="text-lg font-bold">{state.heartRate}</span>
                    <span className="text-[10px] text-gray-500">BPM</span>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-2 flex flex-col items-center border border-gray-800">
                    <Flame size={16} className="text-orange-500 mb-1" />
                    <span className="text-lg font-bold">{state.calories}</span>
                    <span className="text-[10px] text-gray-500">KCAL</span>
                </div>
            </div>

            {/* Sensor Viz (Background) */}
            <div className="absolute top-1/2 left-0 w-full h-24 opacity-20 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorData}>
                        <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                {state.status === ActivityStatus.IDLE || state.status === ActivityStatus.PAUSED ? (
                    <button 
                        onClick={() => onAction('START')}
                        className="col-span-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white rounded-full py-3 font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Play size={18} fill="currentColor" /> START
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={() => onAction('PAUSE')}
                            className="bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-white rounded-full py-3 font-bold flex items-center justify-center"
                        >
                            <Pause size={18} fill="currentColor" />
                        </button>
                        <button 
                            onClick={() => onAction('RESET')}
                            className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-full py-3 font-bold flex items-center justify-center"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* Simulation Trigger (Since we don't have real sensors) */}
            {state.status === ActivityStatus.ACTIVE && (
                <button 
                    onClick={handleSimulateMotion}
                    className="absolute inset-0 z-20 opacity-0 cursor-pointer"
                    title="Click anywhere on watch face to simulate motion"
                >
                    Hidden Sensor Trigger
                </button>
            )}
             {state.status === ActivityStatus.ACTIVE && (
                 <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none">
                    <span className="bg-black/80 px-2 py-1 rounded text-[10px] text-gray-400 border border-gray-800">Tap screen to simulate rep</span>
                 </div>
            )}
        </div>
    </div>
  );
};