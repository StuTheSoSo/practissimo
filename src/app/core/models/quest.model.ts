import { Instrument } from "./instrument.model";

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetMinutes?: number;
  targetSessions?: number;
  targetCategory?: string;
  progress: number;
  target: number;
  completed: boolean;
  xpReward: number;
  instrument: Instrument;
  expiresAt: string; // ISO 8601 format
}
