import { WorkoutState, ActivityStatus } from './types';

export const INITIAL_STATE: WorkoutState = {
  count: 0,
  target: 15,
  calories: 0,
  duration: 0,
  heartRate: 72,
  status: ActivityStatus.IDLE
};

export const CALORIES_PER_REP = 0.5;