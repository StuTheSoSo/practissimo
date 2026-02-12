export interface WeeklyTarget {
  weekStartDate: string; // YYYY-MM-DD, local week start (Monday)
  targetMinutes: number;
  minutesCompleted: number;
  sessionsCompleted: number;
  lastUpdatedAt: string; // ISO timestamp
}
