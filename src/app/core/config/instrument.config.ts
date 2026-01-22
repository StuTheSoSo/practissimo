// src/app/core/config/instrument.config.ts
import { Instrument, InstrumentConfig } from '../models/instrument.model';

/**
 * Centralized instrument configuration
 * Adding a new instrument only requires adding an entry here
 */
export const INSTRUMENT_CONFIG: Record<Instrument, InstrumentConfig> = {
  guitar: {
    id: 'guitar',
    displayName: 'Guitar',
    icon: 'musical-notes', // Ionic icon name
    categories: ['Scales', 'Chords', 'Songs', 'Technique', 'Ear Training']
  },
  bass: {
    id: 'bass',
    displayName: 'Bass',
    icon: 'musical-note',
    categories: ['Scales', 'Chords', 'Grooves', 'Songs', 'Technique']
  },
  piano: {
    id: 'piano',
    displayName: 'Piano',
    icon: 'piano',
    categories: ['Scales', 'Chords', 'Repertoire', 'Technique', 'Sight Reading']
  },
  drums: {
    id: 'drums',
    displayName: 'Drums',
    icon: 'disc',
    categories: ['Rudiments', 'Grooves', 'Songs', 'Technique', 'Fills']
  },
  violin: {
    id: 'violin',
    displayName: 'Violin',
    icon: 'musical-notes-outline',
    categories: ['Scales', 'Études', 'Repertoire', 'Technique', 'Sight Reading']
  }
};

/**
 * Get all available instruments
 */
export function getAllInstruments(): InstrumentConfig[] {
  return Object.values(INSTRUMENT_CONFIG);
}

/**
 * Get configuration for a specific instrument
 */
export function getInstrumentConfig(instrument: Instrument): InstrumentConfig {
  return INSTRUMENT_CONFIG[instrument];
}

/**
 * Validate if a category is valid for an instrument
 */
export function isValidCategory(instrument: Instrument, category: string): boolean {
  return INSTRUMENT_CONFIG[instrument].categories.includes(category);
}

/**
 * Get display name for an instrument
 */
export function getInstrumentDisplayName(instrument: Instrument): string {
  return INSTRUMENT_CONFIG[instrument].displayName;
}

/**
 * Get categories for current instrument
 */
export function getInstrumentCategories(instrument: Instrument): string[] {
  return INSTRUMENT_CONFIG[instrument].categories;
}
