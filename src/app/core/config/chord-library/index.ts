// src/app/core/config/chord-library/index.ts
import { Chord } from '../../models/chord.model';
import { GUITAR_CHORDS } from './guitar-chords.config';
import { PIANO_CHORDS } from './piano-chords.config';

export const CHORD_LIBRARY: Chord[] = [
  ...GUITAR_CHORDS,
  ...PIANO_CHORDS
];

function variationSignature(variation: Chord['variations'][number]): string {
  const positions = JSON.stringify(variation.positions);
  return `${variation.id}::${variation.name}::${positions}`;
}

function dedupeChordLibrary(chords: Chord[]): Chord[] {
  const byId = new Map<string, Chord>();

  for (const chord of chords) {
    const existing = byId.get(chord.id);

    if (!existing) {
      byId.set(chord.id, {
        ...chord,
        commonIn: chord.commonIn ? [...chord.commonIn] : chord.commonIn,
        variations: chord.variations ? [...chord.variations] : []
      });
      continue;
    }

    // Merge usage metadata without duplicates.
    const mergedCommonIn = new Set<string>([
      ...(existing.commonIn ?? []),
      ...(chord.commonIn ?? [])
    ]);
    existing.commonIn = mergedCommonIn.size > 0 ? Array.from(mergedCommonIn) : existing.commonIn;

    // Merge unique variations by id+shape signature.
    const seen = new Set(existing.variations.map(v => variationSignature(v)));
    for (const variation of chord.variations) {
      const signature = variationSignature(variation);
      if (!seen.has(signature)) {
        existing.variations.push(variation);
        seen.add(signature);
      }
    }
  }

  return Array.from(byId.values());
}

export const CHORD_LIBRARY_DEDUPED: Chord[] = dedupeChordLibrary(CHORD_LIBRARY);

/**
 * Get chords for specific instrument
 */
export function getChordsForInstrument(instrument: string): Chord[] {
  return CHORD_LIBRARY_DEDUPED.filter(chord => chord.instrument === instrument);
}

/**
 * Get chords by category
 */
export function getChordsByCategory(instrument: string, category: string): Chord[] {
  return CHORD_LIBRARY_DEDUPED.filter(
    chord => chord.instrument === instrument && chord.category === category
  );
}

/**
 * Get chords by difficulty
 */
export function getChordsByDifficulty(instrument: string, difficulty: string): Chord[] {
  return CHORD_LIBRARY_DEDUPED.filter(
    chord => chord.instrument === instrument && chord.difficulty === difficulty
  );
}

/**
 * Search chords by name
 */
export function searchChords(instrument: string, query: string): Chord[] {
  const lowerQuery = query.toLowerCase();
  return CHORD_LIBRARY_DEDUPED.filter(
    chord =>
      chord.instrument === instrument &&
      (chord.name.toLowerCase().includes(lowerQuery) ||
        chord.displayName.toLowerCase().includes(lowerQuery))
  );
}
