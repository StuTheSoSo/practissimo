// src/app/core/config/tuner.config.ts
import { TuningPreset } from '../models/tuner.model';

/**
 * Standard tuning presets for guitar, bass, and violin
 */
export const TUNING_PRESETS: TuningPreset[] = [
  // ============================================================================
  // GUITAR TUNINGS
  // ============================================================================
  {
    id: 'guitar_standard',
    name: 'Standard (E A D G B E)',
    instrument: 'guitar',
    strings: [
      { name: 'E', octave: 4, frequency: 329.63, stringNumber: 1 }, // High E
      { name: 'B', octave: 3, frequency: 246.94, stringNumber: 2 },
      { name: 'G', octave: 3, frequency: 196.00, stringNumber: 3 },
      { name: 'D', octave: 3, frequency: 146.83, stringNumber: 4 },
      { name: 'A', octave: 2, frequency: 110.00, stringNumber: 5 },
      { name: 'E', octave: 2, frequency: 82.41, stringNumber: 6 }  // Low E
    ]
  },
  {
    id: 'guitar_drop_d',
    name: 'Drop D (D A D G B E)',
    instrument: 'guitar',
    strings: [
      { name: 'E', octave: 4, frequency: 329.63, stringNumber: 1 },
      { name: 'B', octave: 3, frequency: 246.94, stringNumber: 2 },
      { name: 'G', octave: 3, frequency: 196.00, stringNumber: 3 },
      { name: 'D', octave: 3, frequency: 146.83, stringNumber: 4 },
      { name: 'A', octave: 2, frequency: 110.00, stringNumber: 5 },
      { name: 'D', octave: 2, frequency: 73.42, stringNumber: 6 }   // Dropped to D
    ]
  },
  {
    id: 'guitar_half_step_down',
    name: 'Half Step Down (Eb Ab Db Gb Bb Eb)',
    instrument: 'guitar',
    strings: [
      { name: 'Eb', octave: 4, frequency: 311.13, stringNumber: 1 },
      { name: 'Bb', octave: 3, frequency: 233.08, stringNumber: 2 },
      { name: 'Gb', octave: 3, frequency: 185.00, stringNumber: 3 },
      { name: 'Db', octave: 3, frequency: 138.59, stringNumber: 4 },
      { name: 'Ab', octave: 2, frequency: 103.83, stringNumber: 5 },
      { name: 'Eb', octave: 2, frequency: 77.78, stringNumber: 6 }
    ]
  },
  {
    id: 'guitar_open_g',
    name: 'Open G (D G D G B D)',
    instrument: 'guitar',
    strings: [
      { name: 'D', octave: 4, frequency: 293.66, stringNumber: 1 },
      { name: 'B', octave: 3, frequency: 246.94, stringNumber: 2 },
      { name: 'G', octave: 3, frequency: 196.00, stringNumber: 3 },
      { name: 'D', octave: 3, frequency: 146.83, stringNumber: 4 },
      { name: 'G', octave: 2, frequency: 98.00, stringNumber: 5 },
      { name: 'D', octave: 2, frequency: 73.42, stringNumber: 6 }
    ]
  },

  // ============================================================================
  // BASS TUNINGS
  // ============================================================================
  {
    id: 'bass_standard',
    name: 'Standard 4-String (E A D G)',
    instrument: 'bass',
    strings: [
      { name: 'G', octave: 2, frequency: 98.00, stringNumber: 1 },  // Highest
      { name: 'D', octave: 2, frequency: 73.42, stringNumber: 2 },
      { name: 'A', octave: 1, frequency: 55.00, stringNumber: 3 },
      { name: 'E', octave: 1, frequency: 41.20, stringNumber: 4 }   // Lowest
    ]
  },
  {
    id: 'bass_5_string',
    name: 'Standard 5-String (B E A D G)',
    instrument: 'bass',
    strings: [
      { name: 'G', octave: 2, frequency: 98.00, stringNumber: 1 },
      { name: 'D', octave: 2, frequency: 73.42, stringNumber: 2 },
      { name: 'A', octave: 1, frequency: 55.00, stringNumber: 3 },
      { name: 'E', octave: 1, frequency: 41.20, stringNumber: 4 },
      { name: 'B', octave: 0, frequency: 30.87, stringNumber: 5 }   // Low B
    ]
  },
  {
    id: 'bass_drop_d',
    name: 'Drop D (D A D G)',
    instrument: 'bass',
    strings: [
      { name: 'G', octave: 2, frequency: 98.00, stringNumber: 1 },
      { name: 'D', octave: 2, frequency: 73.42, stringNumber: 2 },
      { name: 'A', octave: 1, frequency: 55.00, stringNumber: 3 },
      { name: 'D', octave: 1, frequency: 36.71, stringNumber: 4 }   // Dropped to D
    ]
  },

  // ============================================================================
  // VIOLIN TUNINGS
  // ============================================================================
  {
    id: 'violin_standard',
    name: 'Standard (G D A E)',
    instrument: 'violin',
    strings: [
      { name: 'E', octave: 5, frequency: 659.26, stringNumber: 1 },  // Highest
      { name: 'A', octave: 4, frequency: 440.00, stringNumber: 2 },
      { name: 'D', octave: 4, frequency: 293.66, stringNumber: 3 },
      { name: 'G', octave: 3, frequency: 196.00, stringNumber: 4 }   // Lowest
    ]
  }
];

/**
 * Get tuning presets for specific instrument
 */
export function getTuningsForInstrument(instrument: string): TuningPreset[] {
  return TUNING_PRESETS.filter(preset => preset.instrument === instrument);
}

/**
 * Get default tuning for instrument
 */
export function getDefaultTuning(instrument: string): TuningPreset | undefined {
  const tunings = getTuningsForInstrument(instrument);
  return tunings[0]; // First one is always standard tuning
}

/**
 * Note names for conversion
 */
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Enharmonic equivalents
 */
export const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
};
