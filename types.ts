export enum ActivityStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface WorkoutState {
  count: number;
  target: number;
  calories: number;
  duration: number; // in seconds
  heartRate: number;
  status: ActivityStatus;
}

export interface GlowColor {
  r: number;
  g: number;
  b: number;
}

// Patent claim specific states
export enum LightPhase {
  PHASE_1 = 'PHASE_1', // 0-33% (Red/Warm)
  PHASE_2 = 'PHASE_2', // 34-66% (Yellow/Amber)
  PHASE_3 = 'PHASE_3', // 67-100% (Green/Teal)
}