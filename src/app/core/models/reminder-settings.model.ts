export interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:mm
  streakProtection: boolean; // Send extra reminder if haven't practiced
  smartTiming: boolean; // Learn usual practice times
}
