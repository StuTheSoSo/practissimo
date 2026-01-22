export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  startTime: number | null;
  pausedTime: number | null;
}
