import { Instrument } from "./instrument.model";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: AchievementRequirement;
}

export type AchievementType =
  | 'streak'
  | 'total_practice_time'
  | 'sessions_count'
  | 'level'
  | 'instrument_mastery';

export interface AchievementRequirement {
  type: AchievementType;
  target: number;
  instrument?: Instrument; // optional, for instrument-specific achievements
}
