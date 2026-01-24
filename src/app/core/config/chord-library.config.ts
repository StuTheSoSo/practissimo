// src/app/core/config/chord-library.config.ts
import { Chord, GuitarChordPosition } from '../models/chord.model';

/**
 * Complete chord library for all instruments
 * This is a starter set - can be expanded significantly
 */
export const CHORD_LIBRARY: Chord[] = [
  // ============================================================================
  // GUITAR - MAJOR CHORDS
  // ============================================================================
  {
    id: 'guitar_c_major',
    name: 'C Major',
    displayName: 'C',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'One of the first chords most guitarists learn',
    commonIn: ['Key of C', 'Key of G', 'Pop songs'],
    variations: [
      {
        id: 'c_major_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 2, 'o', 1, 'o'],
          fingers: [null, 3, 2, null, 1, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MAJOR CHORDS (Extended)
  // ============================================================================
  {
    id: 'guitar_b_major',
    name: 'B Major',
    displayName: 'B',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Barre chord - first major barre most guitarists learn',
    commonIn: ['Key of B', 'Key of E', 'Rock'],
    variations: [
      {
        id: 'b_major_barre',
        name: 'Barre Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 2,
          fingering: [2, 4, 4, 3, 2, 2],
          fingers: [1, 3, 4, 2, 1, 1],
          barres: [
            { fret: 2, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_f_major',
    name: 'F Major',
    displayName: 'F',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Classic F barre chord - essential for many songs',
    commonIn: ['Key of F', 'Key of C', 'Pop'],
    variations: [
      {
        id: 'f_major_barre',
        name: 'Barre Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [1, 3, 3, 2, 1, 1],
          fingers: [1, 3, 4, 2, 1, 1],
          barres: [
            { fret: 1, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MINOR CHORDS (Extended)
  // ============================================================================
  {
    id: 'guitar_cm_minor',
    name: 'C Minor',
    displayName: 'Cm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Dark and moody minor chord',
    commonIn: ['Key of Eb', 'Key of Cm', 'Blues'],
    variations: [
      {
        id: 'cm_minor_barre',
        name: 'Barre Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 3,
          fingering: ['x', 3, 5, 5, 4, 3],
          fingers: [null, 1, 3, 4, 2, 1]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_fm_minor',
    name: 'F Minor',
    displayName: 'Fm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Melancholic minor barre chord',
    commonIn: ['Key of Ab', 'Key of Fm', 'Ballads'],
    variations: [
      {
        id: 'fm_minor_barre',
        name: 'Barre Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [1, 3, 3, 1, 1, 1],
          fingers: [1, 3, 4, 1, 1, 1],
          barres: [
            { fret: 1, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_bm_minor',
    name: 'B Minor',
    displayName: 'Bm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Common minor barre chord',
    commonIn: ['Key of D', 'Key of G', 'Folk'],
    variations: [
      {
        id: 'bm_minor_barre',
        name: 'Barre Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 2,
          fingering: ['x', 2, 4, 4, 3, 2],
          fingers: [null, 1, 3, 4, 2, 1]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_gm_minor',
    name: 'G Minor',
    displayName: 'Gm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Soulful minor chord',
    commonIn: ['Key of Bb', 'Key of Gm', 'Blues'],
    variations: [
      {
        id: 'gm_minor_barre',
        name: 'Barre Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 3,
          fingering: [3, 5, 5, 3, 3, 3],
          fingers: [1, 3, 4, 1, 1, 1],
          barres: [
            { fret: 3, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - DOMINANT 7TH CHORDS (Extended)
  // ============================================================================
  {
    id: 'guitar_a7',
    name: 'A Dominant 7',
    displayName: 'A7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Essential blues and country chord',
    commonIn: ['Blues', 'Country', 'Key of D'],
    variations: [
      {
        id: 'a7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 'o', 2, 'o'],
          fingers: [null, null, 2, null, 3, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_d7',
    name: 'D Dominant 7',
    displayName: 'D7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Sweet dominant seventh',
    commonIn: ['Blues', 'Jazz', 'Key of G'],
    variations: [
      {
        id: 'd7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 1, 2],
          fingers: [null, null, null, 2, 1, 3]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_e7',
    name: 'E Dominant 7',
    displayName: 'E7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Full, rich seventh chord',
    commonIn: ['Blues', 'Rock', 'Key of A'],
    variations: [
      {
        id: 'e7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 'o', 1, 'o', 'o'],
          fingers: [null, 2, null, 1, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_b7',
    name: 'B Dominant 7',
    displayName: 'B7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Common dominant in many keys',
    commonIn: ['Blues', 'Jazz', 'Key of E'],
    variations: [
      {
        id: 'b7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 2, 1, 2, 'o', 2],
          fingers: [null, 2, 1, 3, null, 4]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MAJOR 7TH CHORDS
  // ============================================================================
  {
    id: 'guitar_cmaj7',
    name: 'C Major 7',
    displayName: 'Cmaj7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Dreamy, jazzy major seventh',
    commonIn: ['Jazz', 'Bossa Nova', 'Pop'],
    variations: [
      {
        id: 'cmaj7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 2, 'o', 'o', 'o'],
          fingers: [null, 3, 2, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_amaj7',
    name: 'A Major 7',
    displayName: 'Amaj7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Bright and sophisticated',
    commonIn: ['Jazz', 'R&B', 'Pop'],
    variations: [
      {
        id: 'amaj7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 1, 2, 'o'],
          fingers: [null, null, 2, 1, 3, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_dmaj7',
    name: 'D Major 7',
    displayName: 'Dmaj7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Warm and jazzy',
    commonIn: ['Jazz', 'Folk', 'Pop'],
    variations: [
      {
        id: 'dmaj7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 2, 2],
          fingers: [null, null, null, 1, 2, 3]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MINOR 7TH CHORDS
  // ============================================================================
  {
    id: 'guitar_am7',
    name: 'A Minor 7',
    displayName: 'Am7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Smooth, mellow minor seventh',
    commonIn: ['Jazz', 'R&B', 'Pop'],
    variations: [
      {
        id: 'am7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 'o', 1, 'o'],
          fingers: [null, null, 2, null, 1, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_em7',
    name: 'E Minor 7',
    displayName: 'Em7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Beautiful, open minor seventh',
    commonIn: ['Jazz', 'R&B', 'Folk'],
    variations: [
      {
        id: 'em7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 'o', 'o', 'o', 'o'],
          fingers: [null, 2, null, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_dm7',
    name: 'D Minor 7',
    displayName: 'Dm7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Melancholic minor seventh',
    commonIn: ['Jazz', 'Blues', 'Pop'],
    variations: [
      {
        id: 'dm7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 1, 1],
          fingers: [null, null, null, 2, 1, 1]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - SUSPENDED CHORDS
  // ============================================================================
  {
    id: 'guitar_asus2',
    name: 'A Suspended 2',
    displayName: 'Asus2',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Open, airy suspended chord',
    commonIn: ['Rock', 'Alternative', 'Ambient'],
    variations: [
      {
        id: 'asus2_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 2, 'o', 'o'],
          fingers: [null, null, 1, 2, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_asus4',
    name: 'A Suspended 4',
    displayName: 'Asus4',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Tension and resolution',
    commonIn: ['Rock', 'Pop', 'Folk'],
    variations: [
      {
        id: 'asus4_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 2, 3, 'o'],
          fingers: [null, null, 2, 3, 4, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_dsus2',
    name: 'D Suspended 2',
    displayName: 'Dsus2',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Shimmering suspended sound',
    commonIn: ['Folk', 'Rock', 'Ambient'],
    variations: [
      {
        id: 'dsus2_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 3, 'o'],
          fingers: [null, null, null, 1, 2, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_dsus4',
    name: 'D Suspended 4',
    displayName: 'Dsus4',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Classic suspended chord',
    commonIn: ['Folk', 'Country', 'Rock'],
    variations: [
      {
        id: 'dsus4_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 3, 3],
          fingers: [null, null, null, 1, 3, 4]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_esus4',
    name: 'E Suspended 4',
    displayName: 'Esus4',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Full-bodied suspended chord',
    commonIn: ['Rock', 'Pop', 'Alternative'],
    variations: [
      {
        id: 'esus4_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 2, 2, 'o', 'o'],
          fingers: [null, 2, 3, 4, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - DIMINISHED & AUGMENTED
  // ============================================================================
  {
    id: 'guitar_adim',
    name: 'A Diminished',
    displayName: 'Adim',
    category: 'diminished',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Tense, unsettling chord',
    commonIn: ['Jazz', 'Classical', 'Film'],
    variations: [
      {
        id: 'adim_position',
        name: 'Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 1, 2, 1, 2],
          fingers: [null, null, 1, 3, 2, 4]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_caug',
    name: 'C Augmented',
    displayName: 'Caug',
    category: 'augmented',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Mysterious, dreamlike quality',
    commonIn: ['Jazz', 'Film', 'Experimental'],
    variations: [
      {
        id: 'caug_position',
        name: 'Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 2, 1, 1, 'o'],
          fingers: [null, 4, 3, 1, 2, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - ADDITIONAL POWER CHORDS
  // ============================================================================
  {
    id: 'guitar_d5',
    name: 'D Power Chord',
    displayName: 'D5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Essential rock power chord',
    commonIn: ['Rock', 'Metal', 'Punk'],
    variations: [
      {
        id: 'd5_power',
        name: 'D String',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 3, 'x'],
          fingers: [null, null, null, 1, 3, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_g5',
    name: 'G Power Chord',
    displayName: 'G5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Heavy, powerful sound',
    commonIn: ['Rock', 'Metal', 'Grunge'],
    variations: [
      {
        id: 'g5_power',
        name: 'Low E String',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 3,
          fingering: [3, 'x', 'x', 'x', 'x', 'x'],
          fingers: [1, null, null, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_c5',
    name: 'C Power Chord',
    displayName: 'C5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Chunky power chord',
    commonIn: ['Rock', 'Punk', 'Metal'],
    variations: [
      {
        id: 'c5_power',
        name: 'A String',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 3,
          fingering: ['x', 3, 5, 'x', 'x', 'x'],
          fingers: [null, 1, 3, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_d_major',
    name: 'D Major',
    displayName: 'D',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Common open chord in many keys',
    commonIn: ['Key of D', 'Key of A', 'Folk songs'],
    variations: [
      {
        id: 'd_major_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 3, 2],
          fingers: [null, null, null, 1, 3, 2]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_e_major',
    name: 'E Major',
    displayName: 'E',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Full, rich open chord',
    commonIn: ['Key of E', 'Key of A', 'Blues', 'Rock'],
    variations: [
      {
        id: 'e_major_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 2, 1, 'o', 'o'],
          fingers: [null, 2, 3, 1, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_g_major',
    name: 'G Major',
    displayName: 'G',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Popular open chord with multiple variations',
    commonIn: ['Key of G', 'Key of C', 'Country', 'Folk'],
    variations: [
      {
        id: 'g_major_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [3, 2, 'o', 'o', 'o', 3],
          fingers: [3, 2, null, null, null, 4]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_a_major',
    name: 'A Major',
    displayName: 'A',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Essential open chord',
    commonIn: ['Key of A', 'Key of D', 'Rock', 'Pop'],
    variations: [
      {
        id: 'a_major_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 2, 2, 'o'],
          fingers: [null, null, 2, 3, 4, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MINOR CHORDS
  // ============================================================================
  {
    id: 'guitar_am_minor',
    name: 'A Minor',
    displayName: 'Am',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'One of the easiest chords to learn',
    commonIn: ['Key of C', 'Key of Am', 'Ballads'],
    variations: [
      {
        id: 'am_minor_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 2, 1, 'o'],
          fingers: [null, null, 2, 3, 1, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_em_minor',
    name: 'E Minor',
    displayName: 'Em',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Two-finger chord, very easy',
    commonIn: ['Key of G', 'Key of Em', 'Pop', 'Rock'],
    variations: [
      {
        id: 'em_minor_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 2, 'o', 'o', 'o'],
          fingers: [null, 2, 3, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_dm_minor',
    name: 'D Minor',
    displayName: 'Dm',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Common minor chord',
    commonIn: ['Key of F', 'Key of Dm', 'Classical'],
    variations: [
      {
        id: 'dm_minor_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 3, 1],
          fingers: [null, null, null, 2, 3, 1]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - SEVENTH CHORDS
  // ============================================================================
  {
    id: 'guitar_g7',
    name: 'G Dominant 7',
    displayName: 'G7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Common dominant seventh chord',
    commonIn: ['Blues', 'Jazz', 'Key of C'],
    variations: [
      {
        id: 'g7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [3, 2, 'o', 'o', 'o', 1],
          fingers: [3, 2, null, null, null, 1]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_c7',
    name: 'C Dominant 7',
    displayName: 'C7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Bluesy dominant seventh',
    commonIn: ['Blues', 'Jazz', 'Key of F'],
    variations: [
      {
        id: 'c7_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 2, 3, 1, 'o'],
          fingers: [null, 3, 2, 4, 1, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - POWER CHORDS
  // ============================================================================
  {
    id: 'guitar_e5',
    name: 'E Power Chord',
    displayName: 'E5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Essential rock chord',
    commonIn: ['Rock', 'Metal', 'Punk'],
    variations: [
      {
        id: 'e5_power',
        name: 'Low E String',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 2, 'x', 'x', 'x'],
          fingers: [null, 1, 3, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_a5',
    name: 'A Power Chord',
    displayName: 'A5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Moveable power chord shape',
    commonIn: ['Rock', 'Metal', 'Grunge'],
    variations: [
      {
        id: 'a5_power',
        name: 'A String',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 2, 'x', 'x'],
          fingers: [null, null, 1, 3, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // PIANO - MAJOR CHORDS
  // ============================================================================
  {
    id: 'piano_c_major',
    name: 'C Major',
    displayName: 'C',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'All white keys - easiest piano chord',
    commonIn: ['Key of C', 'Classical', 'Pop'],
    variations: [
      {
        id: 'piano_c_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'E', octave: 4, finger: 3 },
            { note: 'G', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_d_major',
    name: 'D Major',
    displayName: 'D',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Common major chord with two black keys',
    commonIn: ['Key of D', 'Bright sound'],
    variations: [
      {
        id: 'piano_d_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 4, finger: 1 },
            { note: 'F#', octave: 4, finger: 3 },
            { note: 'A', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_e_major',
    name: 'E Major',
    displayName: 'E',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Major chord with four sharps',
    commonIn: ['Key of E', 'Bright and ringing'],
    variations: [
      {
        id: 'piano_e_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'E', octave: 4, finger: 1 },
            { note: 'G#', octave: 4, finger: 3 },
            { note: 'B', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_f_major',
    name: 'F Major',
    displayName: 'F',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Warm major chord with one flat',
    commonIn: ['Key of F', 'Classical', 'Hymns'],
    variations: [
      {
        id: 'piano_f_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F', octave: 4, finger: 1 },
            { note: 'A', octave: 4, finger: 3 },
            { note: 'C', octave: 5, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_g_major',
    name: 'G Major',
    displayName: 'G',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Bright major chord with one sharp',
    commonIn: ['Key of G', 'Folk', 'Classical'],
    variations: [
      {
        id: 'piano_g_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'G', octave: 4, finger: 1 },
            { note: 'B', octave: 4, finger: 3 },
            { note: 'D', octave: 5, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_a_major',
    name: 'A Major',
    displayName: 'A',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Resonant major chord',
    commonIn: ['Key of A', 'Romantic'],
    variations: [
      {
        id: 'piano_a_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'A', octave: 4, finger: 1 },
            { note: 'C#', octave: 5, finger: 3 },
            { note: 'E', octave: 5, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_b_major',
    name: 'B Major',
    displayName: 'B',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Major chord with five sharps',
    commonIn: ['Key of B', 'Brilliant sound'],
    variations: [
      {
        id: 'piano_b_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'B', octave: 4, finger: 1 },
            { note: 'D#', octave: 5, finger: 3 },
            { note: 'F#', octave: 5, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - MINOR CHORDS
  // ============================================================================
  {
    id: 'piano_am_minor',
    name: 'A Minor',
    displayName: 'Am',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'All white keys - easiest minor chord',
    commonIn: ['Key of C', 'Sad and contemplative'],
    variations: [
      {
        id: 'piano_am_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'A', octave: 4, finger: 1 },
            { note: 'C', octave: 5, finger: 3 },
            { note: 'E', octave: 5, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_dm_minor',
    name: 'D Minor',
    displayName: 'Dm',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Melancholic minor chord',
    commonIn: ['Key of F', 'Classical', 'Emotional'],
    variations: [
      {
        id: 'piano_dm_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 4, finger: 1 },
            { note: 'F', octave: 4, finger: 3 },
            { note: 'A', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_em_minor',
    name: 'E Minor',
    displayName: 'Em',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Dark and mysterious',
    commonIn: ['Key of G', 'Gothic', 'Dramatic'],
    variations: [
      {
        id: 'piano_em_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'E', octave: 4, finger: 1 },
            { note: 'G', octave: 4, finger: 3 },
            { note: 'B', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - SEVENTH CHORDS
  // ============================================================================
  {
    id: 'piano_c7',
    name: 'C Dominant 7',
    displayName: 'C7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Blues and jazz essential',
    commonIn: ['Blues', 'Jazz', 'Key of F'],
    variations: [
      {
        id: 'piano_c7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'E', octave: 4, finger: 2 },
            { note: 'G', octave: 4, finger: 3 },
            { note: 'Bb', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_g7',
    name: 'G Dominant 7',
    displayName: 'G7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Classic resolution to C',
    commonIn: ['Jazz', 'Blues', 'Key of C'],
    variations: [
      {
        id: 'piano_g7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'G', octave: 4, finger: 1 },
            { note: 'B', octave: 4, finger: 2 },
            { note: 'D', octave: 5, finger: 3 },
            { note: 'F', octave: 5, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_cmaj7',
    name: 'C Major 7',
    displayName: 'Cmaj7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Dreamy and sophisticated',
    commonIn: ['Jazz', 'Bossa Nova', 'Ballads'],
    variations: [
      {
        id: 'piano_cmaj7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'E', octave: 4, finger: 2 },
            { note: 'G', octave: 4, finger: 3 },
            { note: 'B', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  }
];

/**
 * Get chords for specific instrument
 */
export function getChordsForInstrument(instrument: string): Chord[] {
  return CHORD_LIBRARY.filter(chord => chord.instrument === instrument);
}

/**
 * Get chords by category
 */
export function getChordsByCategory(instrument: string, category: string): Chord[] {
  return CHORD_LIBRARY.filter(
    chord => chord.instrument === instrument && chord.category === category
  );
}

/**
 * Get chords by difficulty
 */
export function getChordsByDifficulty(instrument: string, difficulty: string): Chord[] {
  return CHORD_LIBRARY.filter(
    chord => chord.instrument === instrument && chord.difficulty === difficulty
  );
}

/**
 * Search chords by name
 */
export function searchChords(instrument: string, query: string): Chord[] {
  const lowerQuery = query.toLowerCase();
  return CHORD_LIBRARY.filter(
    chord =>
      chord.instrument === instrument &&
      (chord.name.toLowerCase().includes(lowerQuery) ||
        chord.displayName.toLowerCase().includes(lowerQuery))
  );
} 6
