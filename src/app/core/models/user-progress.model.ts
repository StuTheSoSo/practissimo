import { Instrument } from "./instrument.model";

export interface UserProgress {
  selectedInstrument: Instrument;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  achievements: string[]; // achievement IDs
  lastActiveDate: string; // ISO 8601 format
  createdAt: string;
}
