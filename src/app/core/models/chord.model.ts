// src/app/core/models/chord.model.ts
import { Instrument } from './instrument.model';

/**
 * Represents a single chord with its variations
 */
export interface Chord {
  id: string;
  name: string; // e.g., "C Major", "Am7", "D"
  displayName: string; // e.g., "C", "Am7"
  category: ChordCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instrument: Instrument;
  variations: ChordVariation[];
  audioFile?: string; // Optional: URL to audio sample
  description?: string;
  commonIn?: string[]; // e.g., ["Key of C", "Pop songs"]
}

/**
 * Different ways to play the same chord
 */
export interface ChordVariation {
  id: string;
  name: string; // e.g., "Open Position", "Barre Chord", "Jazz Voicing"
  positions: ChordPosition;
  isPrimary: boolean; // The most common fingering
}

/**
 * Chord category for organization
 */
export type ChordCategory =
  | 'major'
  | 'minor'
  | 'seventh'
  | 'extended'
  | 'suspended'
  | 'diminished'
  | 'augmented'
  | 'power';

/**
 * Instrument-specific chord positions
 */
export type ChordPosition =
  | GuitarChordPosition
  | PianoChordPosition
  | UkuleleChordPosition;

/**
 * Guitar/Bass chord diagram data
 */
export interface GuitarChordPosition {
  type: 'guitar' | 'bass';
  strings: number; // 6 for guitar, 4 for bass
  frets: number; // How many frets to show (usually 4-5)
  baseFret: number; // Starting fret (1 for open chords)
  fingering: (number | 'x' | 'o')[]; // Array per string: fret number, 'x' (muted), 'o' (open)
  fingers?: (number | null)[]; // Optional: which finger to use (1-4)
  barres?: Barre[]; // For barre chords
}

export interface Barre {
  fret: number;
  fromString: number;
  toString: number;
  finger: number;
}

/**
 * Piano chord data
 */
export interface PianoChordPosition {
  type: 'piano';
  notes: PianoNote[]; // Which keys to press
  octave: number; // Starting octave
  leftHand?: boolean; // True if typically played with left hand
}

export interface PianoNote {
  note: string; // e.g., "C", "C#", "Db"
  octave: number;
  finger?: number; // Suggested finger (1-5)
}

/**
 * Ukulele chord (similar to guitar but 4 strings)
 */
export interface UkuleleChordPosition {
  type: 'ukulele';
  strings: 4;
  frets: number;
  baseFret: number;
  fingering: (number | 'x' | 'o')[];
  fingers?: (number | null)[];
}

/**
 * User's favorite/saved chords
 */
export interface SavedChord {
  chordId: string;
  savedAt: string;
  notes?: string; // User notes about this chord
}
