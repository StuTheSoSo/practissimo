export type RepertoireStatus = 'Learning' | 'Polishing' | 'Ready' | 'Archived';

export interface RepertoireItem {
  id: string;
  title: string;
  instrument: string;
  status: RepertoireStatus;
  composer?: string;
  notes?: string;
  dateAdded: string; // ISO 8601 format
  lastPracticed?: string; // ISO 8601 format
  practiceCount: number;
  targetTempo?: number; // BPM for tempo tracking
  currentTempo?: number; // Current BPM achieved
}
