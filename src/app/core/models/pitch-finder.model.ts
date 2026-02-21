export type PitchNote = 'C' | 'C#' | 'D' | 'Eb' | 'E' | 'F' | 'F#' | 'G' | 'Ab' | 'A' | 'Bb' | 'B';

export type HarmonyInterval = 'unison' | 'm3' | 'M3' | 'P4' | 'P5' | 'octave';

export type HarmonyDirection = 'above' | 'below';

export interface NotePitch {
  note: PitchNote;
  octave: number;
  frequency: number;
}

export const PITCH_NOTES: PitchNote[] = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const HARMONY_INTERVALS: { value: HarmonyInterval; label: string }[] = [
  { value: 'unison', label: 'Unison' },
  { value: 'm3', label: 'm3 (Minor 3rd)' },
  { value: 'M3', label: 'M3 (Major 3rd)' },
  { value: 'P4', label: 'P4 (Perfect 4th)' },
  { value: 'P5', label: 'P5 (Perfect 5th)' },
  { value: 'octave', label: 'Octave' }
];

export const INTERVAL_TO_SEMITONES: Record<HarmonyInterval, number> = {
  unison: 0,
  m3: 3,
  M3: 4,
  P4: 5,
  P5: 7,
  octave: 12
};
