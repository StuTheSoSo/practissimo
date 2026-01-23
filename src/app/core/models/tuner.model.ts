// src/app/core/models/tuner.model.ts

/**
 * Tuner state
 */
export interface TunerState {
  isListening: boolean;
  currentFrequency: number;
  detectedNote: string;
  detectedOctave: number;
  cents: number; // -50 to +50
  clarity: number; // 0 to 1 (confidence)
  targetNote?: StringInfo;
}

/**
 * String information for instrument
 */
export interface StringInfo {
  name: string; // e.g., "E", "A", "D"
  octave: number;
  frequency: number; // Target frequency in Hz
  stringNumber: number; // 1-6 for guitar
}

/**
 * Tuning preset
 */
export interface TuningPreset {
  id: string;
  name: string;
  instrument: 'guitar' | 'bass' | 'violin';
  strings: StringInfo[];
}

/**
 * Note information
 */
export interface NoteInfo {
  note: string;
  octave: number;
  frequency: number;
  cents: number;
}

/**
 * Tuner settings
 */
export interface TunerSettings {
  a4Frequency: number; // Usually 440Hz, can be 442Hz
  selectedTuning: string; // Preset ID
  autoDetectString: boolean;
  showFrequency: boolean;
}
