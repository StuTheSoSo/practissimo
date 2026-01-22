import { Instrument } from "./instrument.model";

export interface PracticeSession {
  id: string;
  instrument: Instrument;
  date: string; // ISO 8601 format
  duration: number; // minutes
  category: string;
  notes?: string;
  xpEarned: number;
}
