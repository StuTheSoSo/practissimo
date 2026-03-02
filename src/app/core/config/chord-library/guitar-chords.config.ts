// src/app/core/config/chord-library/guitar-chords.config.ts
import { Chord, GuitarChordPosition } from '../../models/chord.model';

export const GUITAR_CHORDS: Chord[] = [
  // ============================================================================
  // GUITAR - MORE SUSPENDED CHORDS
  // ============================================================================

  {
    id: 'guitar_esus2',
    name: 'E Suspended 2',
    displayName: 'Esus2',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Open, ringing suspended chord',
    commonIn: ['Rock', 'Alternative', 'Ambient'],
    variations: [
      {
        id: 'esus2_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 2, 'o', 'o', 'o'],
          fingers: [null, 1, 2, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_gsus2',
    name: 'G Suspended 2',
    displayName: 'Gsus2',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Full, open suspended chord',
    commonIn: ['Rock', 'Folk', 'Alternative'],
    variations: [
      {
        id: 'gsus2_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [3, 'o', 'o', 'o', 3, 3],
          fingers: [1, null, null, null, 3, 4]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_csus2',
    name: 'C Suspended 2',
    displayName: 'Csus2',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Bright suspended chord',
    commonIn: ['Pop', 'Rock', 'Folk'],
    variations: [
      {
        id: 'csus2_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 'o', 'o', 3, 3],
          fingers: [null, 1, null, null, 3, 4]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MORE ADD9 CHORDS
  // ============================================================================

  {
    id: 'guitar_dadd9',
    name: 'D Add9',
    displayName: 'Dadd9',
    category: 'extended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Bright, shimmering add9',
    commonIn: ['Pop', 'Folk', 'Alternative'],
    variations: [
      {
        id: 'dadd9_open',
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
    id: 'guitar_eadd9',
    name: 'E Add9',
    displayName: 'Eadd9',
    category: 'extended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Full, rich add9 chord',
    commonIn: ['Pop', 'Rock', 'Alternative'],
    variations: [
      {
        id: 'eadd9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 2, 1, 'o', 2],
          fingers: [null, 2, 3, 1, null, 4]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_aadd9',
    name: 'A Add9',
    displayName: 'Aadd9',
    category: 'extended',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Sweet add9 chord',
    commonIn: ['Pop', 'Folk', 'Singer-songwriter'],
    variations: [
      {
        id: 'aadd9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 4, 'o', 'o'],
          fingers: [null, null, 1, 3, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MORE POWER CHORDS
  // ============================================================================

  {
    id: 'guitar_f5',
    name: 'F Power Chord',
    displayName: 'F5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Essential rock power chord',
    commonIn: ['Rock', 'Metal', 'Punk'],
    variations: [
      {
        id: 'f5_power',
        name: 'Power Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [1, 3, 3, 'x', 'x', 'x'],
          fingers: [1, 3, 4, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_b5',
    name: 'B Power Chord',
    displayName: 'B5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'High-energy power chord',
    commonIn: ['Rock', 'Metal', 'Punk'],
    variations: [
      {
        id: 'b5_power',
        name: 'Power Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 2,
          fingering: ['x', 2, 4, 4, 'x', 'x'],
          fingers: [null, 1, 3, 4, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_bb5',
    name: 'Bb Power Chord',
    displayName: 'Bb5',
    category: 'power',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Heavy power chord',
    commonIn: ['Rock', 'Metal', 'Punk'],
    variations: [
      {
        id: 'bb5_power',
        name: 'Power Chord',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 1, 3, 3, 'x', 'x'],
          fingers: [null, 1, 3, 4, null, null]
        } as GuitarChordPosition
      }
    ]
  },

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
          fingering: ['x', 2, 4, 4, 4, 2],
          fingers: [null, 1, 3, 3, 3, 1],
          barres: [
            { fret: 2, fromString: 1, toString: 5, finger: 1 },
            { fret: 4, fromString: 2, toString: 4, finger: 3 }
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
  {
  id: 'guitar_d_major',
  name: 'D Major',
  displayName: 'D',
  category: 'major',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Bright, open major chord - one of the first chords to learn',
  commonIn: ['Key of D', 'Key of G', 'Folk', 'Country'],
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
  description: 'Full, resonant open chord - essential for rock and blues',
  commonIn: ['Key of E', 'Key of A', 'Rock', 'Blues'],
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
  description: 'Big, full open chord - staple of folk and rock',
  commonIn: ['Key of G', 'Key of C', 'Folk', 'Rock'],
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
        fingers: [2, 1, null, null, null, 3]
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
  description: 'Bright, cheerful open chord',
  commonIn: ['Key of A', 'Key of D', 'Rock', 'Country'],
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
        fingers: [null, null, 1, 2, 3, null]
      } as GuitarChordPosition
    }
  ]
},

// ============================================================================
// GUITAR - MISSING MINOR CHORDS
// ============================================================================

{
  id: 'guitar_am_minor',
  name: 'A Minor',
  displayName: 'Am',
  category: 'minor',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Somber, easy minor chord - one of the first minors learned',
  commonIn: ['Key of C', 'Key of Am', 'Pop', 'Folk'],
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
  id: 'guitar_dm_minor',
  name: 'D Minor',
  displayName: 'Dm',
  category: 'minor',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Melancholic open minor chord',
  commonIn: ['Key of F', 'Key of C', 'Pop', 'Ballads'],
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

{
  id: 'guitar_em_minor',
  name: 'E Minor',
  displayName: 'Em',
  category: 'minor',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Dark, moody open chord - easiest minor to play',
  commonIn: ['Key of G', 'Key of Em', 'Rock', 'Pop'],
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

// ============================================================================
// GUITAR - MISSING SEVENTH CHORDS
// ============================================================================

{
  id: 'guitar_c7',
  name: 'C Dominant 7',
  displayName: 'C7',
  category: 'seventh',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Jazzy seventh chord - resolves to F',
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

{
  id: 'guitar_g7',
  name: 'G Dominant 7',
  displayName: 'G7',
  category: 'seventh',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Classic seventh - resolves to C',
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
  id: 'guitar_cmaj7',
  name: 'C Major 7',
  displayName: 'Cmaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Dreamy, sophisticated chord',
  commonIn: ['Jazz', 'Pop', 'R&B', 'Key of C'],
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
  id: 'guitar_dmaj7',
  name: 'D Major 7',
  displayName: 'Dmaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Sweet, jazzy major seventh',
  commonIn: ['Jazz', 'Pop', 'Key of D'],
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
        fingers: [null, null, null, 1, 1, 1]
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
  description: 'Smooth minor seventh - very popular in pop',
  commonIn: ['Pop', 'Jazz', 'Key of G'],
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
  id: 'guitar_am7',
  name: 'A Minor 7',
  displayName: 'Am7',
  category: 'seventh',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Mellow minor seventh - extremely common',
  commonIn: ['Pop', 'Jazz', 'R&B', 'Key of C'],
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
  id: 'guitar_dm7',
  name: 'D Minor 7',
  displayName: 'Dm7',
  category: 'seventh',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Jazzy minor seventh',
  commonIn: ['Jazz', 'Pop', 'Key of C'],
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

{
  id: 'guitar_amaj7',
  name: 'A Major 7',
  displayName: 'Amaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Bright major seventh',
  commonIn: ['Jazz', 'Pop', 'Key of A'],
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
  commonIn: ['Alternative', 'Rock', 'Pop'],
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
  description: 'Suspenseful chord that wants to resolve to A major',
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
        fingers: [null, null, 1, 2, 3, null]
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
  description: 'Bright, ringing suspended chord',
  commonIn: ['Alternative', 'Rock', 'Folk'],
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
        fingers: [null, null, null, 1, 3, null]
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
  description: 'Popular sus chord in many songs',
  commonIn: ['Rock', 'Pop', 'Folk'],
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
  description: 'Full, resonant suspended chord',
  commonIn: ['Rock', 'Alternative'],
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
        fingers: [null, 1, 2, 3, null, null]
      } as GuitarChordPosition
    }
  ]
},

// ============================================================================
// GUITAR - POWER CHORDS (Essential for rock)
// ============================================================================

{
  id: 'guitar_c5',
  name: 'C Power Chord',
  displayName: 'C5',
  category: 'power',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Essential rock chord - just root and fifth',
  commonIn: ['Rock', 'Metal', 'Punk'],
  variations: [
    {
      id: 'c5_power',
      name: 'Power Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: ['x', 3, 5, 5, 'x', 'x'],
        fingers: [null, 1, 3, 4, null, null]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_d5',
  name: 'D Power Chord',
  displayName: 'D5',
  category: 'power',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Common rock power chord',
  commonIn: ['Rock', 'Metal', 'Punk'],
  variations: [
    {
      id: 'd5_power',
      name: 'Power Chord',
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
  id: 'guitar_e5',
  name: 'E Power Chord',
  displayName: 'E5',
  category: 'power',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Heavy, low power chord',
  commonIn: ['Rock', 'Metal', 'Grunge'],
  variations: [
    {
      id: 'e5_power',
      name: 'Power Chord',
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
  id: 'guitar_g5',
  name: 'G Power Chord',
  displayName: 'G5',
  category: 'power',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Punchy power chord',
  commonIn: ['Rock', 'Metal', 'Punk'],
  variations: [
    {
      id: 'g5_power',
      name: 'Power Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: [3, 5, 5, 'x', 'x', 'x'],
        fingers: [1, 3, 4, null, null, null]
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
  description: 'Classic rock power chord',
  commonIn: ['Rock', 'Metal', 'Hard Rock'],
  variations: [
    {
      id: 'a5_power',
      name: 'Power Chord',
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
// GUITAR - ADD9 CHORDS
// ============================================================================

{
  id: 'guitar_cadd9',
  name: 'C Add9',
  displayName: 'Cadd9',
  category: 'extended',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Shimmering, modern-sounding chord',
  commonIn: ['Pop', 'Alternative', 'Singer-songwriter'],
  variations: [
    {
      id: 'cadd9_open',
      name: 'Open Position',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: ['x', 3, 2, 'o', 3, 'o'],
        fingers: [null, 2, 1, null, 3, null]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_gadd9',
  name: 'G Add9',
  displayName: 'Gadd9',
  category: 'extended',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Rich, colorful chord',
  commonIn: ['Pop', 'Alternative', 'Folk'],
  variations: [
    {
      id: 'gadd9_open',
      name: 'Open Position',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: [3, 2, 'o', 'o', 3, 3],
        fingers: [2, 1, null, null, 3, 4]
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
  description: 'Tense, dissonant chord',
  commonIn: ['Jazz', 'Classical', 'Film scores'],
  variations: [
    {
      id: 'adim_open',
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
  difficulty: 'advanced',
  instrument: 'guitar',
  description: 'Unstable, mysterious chord',
  commonIn: ['Jazz', 'Classical', 'Experimental'],
  variations: [
    {
      id: 'caug_barre',
      name: 'Barre Position',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: ['x', 3, 2, 1, 1, 'x'],
        fingers: [null, 4, 3, 1, 2, null]
      } as GuitarChordPosition
    }
  ]
},

// ============================================================================
// GUITAR - FLAT KEY MAJOR CHORDS
// ============================================================================

{
  id: 'guitar_ab_major',
  name: 'Ab Major',
  displayName: 'Ab',
  category: 'major',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Warm barre chord',
  commonIn: ['Key of Ab', 'Key of Db', 'Jazz'],
  variations: [
    {
      id: 'ab_major_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 4,
        fingering: [4, 6, 6, 5, 4, 4],
        fingers: [1, 3, 4, 2, 1, 1],
        barres: [
          { fret: 4, fromString: 0, toString: 5, finger: 1 }
        ]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_bb_major',
  name: 'Bb Major',
  displayName: 'Bb',
  category: 'major',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Common barre chord in many keys',
  commonIn: ['Key of Bb', 'Key of F', 'Jazz', 'Pop'],
  variations: [
    {
      id: 'bb_major_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: ['x', 1, 3, 3, 3, 1],
        fingers: [null, 1, 2, 3, 4, 1],
        barres: [
          { fret: 1, fromString: 1, toString: 5, finger: 1 }
        ]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_eb_major',
  name: 'Eb Major',
  displayName: 'Eb',
  category: 'major',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Rich, dark major chord',
  commonIn: ['Key of Eb', 'Key of Ab', 'Blues'],
  variations: [
    {
      id: 'eb_major_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: ['x', 'x', 1, 3, 4, 3],
        fingers: [null, null, 1, 2, 4, 3]
      } as GuitarChordPosition
    }
  ]
},

// ============================================================================
// GUITAR - SHARP KEY MAJOR & MINOR CHORDS
// ============================================================================

{
  id: 'guitar_csharp_major',
  name: 'C# Major',
  displayName: 'C#',
  category: 'major',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Bright barre chord',
  commonIn: ['Key of C#', 'Key of F#', 'Pop'],
  variations: [
    {
      id: 'csharp_major_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 4,
        fingering: ['x', 4, 6, 6, 6, 4],
        fingers: [null, 1, 3, 3, 3, 1],
        barres: [
          { fret: 4, fromString: 1, toString: 5, finger: 1 }
        ]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_fsharp_major',
  name: 'F# Major',
  displayName: 'F#',
  category: 'major',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Powerful barre chord',
  commonIn: ['Key of F#', 'Key of B', 'Rock'],
  variations: [
    {
      id: 'fsharp_major_barre',
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
  id: 'guitar_csharp_minor',
  name: 'C# Minor',
  displayName: 'C#m',
  category: 'minor',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Emotional minor barre chord',
  commonIn: ['Key of A', 'Key of E', 'Pop', 'Ballads'],
  variations: [
    {
      id: 'csharp_minor_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 4,
        fingering: ['x', 4, 6, 6, 5, 4],
        fingers: [null, 1, 3, 4, 2, 1]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_fsharp_minor',
  name: 'F# Minor',
  displayName: 'F#m',
  category: 'minor',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Dark, expressive minor chord',
  commonIn: ['Key of A', 'Key of D', 'Rock', 'Pop'],
  variations: [
    {
      id: 'fsharp_minor_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 2,
        fingering: [2, 4, 4, 2, 2, 2],
        fingers: [1, 3, 4, 1, 1, 1],
        barres: [
          { fret: 2, fromString: 0, toString: 5, finger: 1 }
        ]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_gsharp_minor',
  name: 'G# Minor',
  displayName: 'G#m',
  category: 'minor',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Tense minor barre chord',
  commonIn: ['Key of B', 'Key of E', 'Rock'],
  variations: [
    {
      id: 'gsharp_minor_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 4,
        fingering: [4, 6, 6, 4, 4, 4],
        fingers: [1, 3, 4, 1, 1, 1],
        barres: [
          { fret: 4, fromString: 0, toString: 5, finger: 1 }
        ]
      } as GuitarChordPosition
    }
  ]
},

{
  id: 'guitar_bbm_minor',
  name: 'Bb Minor',
  displayName: 'Bbm',
  category: 'minor',
  difficulty: 'intermediate',
  instrument: 'guitar',
  description: 'Heavy, dramatic minor chord',
  commonIn: ['Key of Db', 'Key of Ab', 'Blues'],
  variations: [
    {
      id: 'bbm_minor_barre',
      name: 'Barre Chord',
      isPrimary: true,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: ['x', 1, 3, 3, 2, 1],
        fingers: [null, 1, 3, 4, 2, 1]
      } as GuitarChordPosition
    }
  ]
},

// ============================================================================
// GUITAR - EASY F MAJOR (for beginners)
// ============================================================================

{
  id: 'guitar_f_major_easy',
  name: 'F Major (Easy)',
  displayName: 'F',
  category: 'major',
  difficulty: 'beginner',
  instrument: 'guitar',
  description: 'Simplified F chord for beginners - excludes bass strings',
  commonIn: ['Key of F', 'Key of C', 'Pop'],
  variations: [
    {
      id: 'f_major_easy_simple',
      name: 'Easy Position',
      isPrimary: false,
      positions: {
        type: 'guitar',
        strings: 6,
        frets: 4,
        baseFret: 1,
        fingering: ['x', 'x', 3, 2, 1, 1],
        fingers: [null, null, 3, 2, 1, 1]
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
  {
    id: 'guitar_csharp_major',
    name: 'C# Major',
    displayName: 'C#',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'A-shape barre chord with a bright, modern tone',
    commonIn: ['Key of C#', 'Key of F#', 'Pop', 'Rock'],
    variations: [
      {
        id: 'csharp_major_barre_a_shape',
        name: 'A-Shape Barre',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 4,
          fingering: ['x', 4, 6, 6, 6, 4],
          fingers: [null, 1, 2, 3, 4, 1],
          barres: [
            { fret: 4, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_eb_major',
    name: 'Eb Major',
    displayName: 'Eb',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Warm barre chord often used in soul and jazz',
    commonIn: ['Key of Eb', 'Soul', 'Jazz', 'Ballads'],
    variations: [
      {
        id: 'eb_major_barre_a_shape',
        name: 'A-Shape Barre',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 6,
          fingering: ['x', 6, 8, 8, 8, 6],
          fingers: [null, 1, 2, 3, 4, 1],
          barres: [
            { fret: 6, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_ab_major',
    name: 'Ab Major',
    displayName: 'Ab',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Bold barre chord with a rich midrange',
    commonIn: ['Key of Ab', 'Key of Db', 'Soul', 'Pop'],
    variations: [
      {
        id: 'ab_major_barre_e_shape',
        name: 'E-Shape Barre',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 4,
          fingering: [4, 6, 6, 5, 4, 4],
          fingers: [1, 3, 4, 2, 1, 1],
          barres: [
            { fret: 4, fromString: 0, toString: 5, finger: 1 }
          ]
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
  {
    id: 'guitar_fsharp_minor',
    name: 'F# Minor',
    displayName: 'F#m',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Common minor barre chord in modern pop and rock',
    commonIn: ['Key of A', 'Key of E', 'Pop', 'Rock'],
    variations: [
      {
        id: 'fsharp_minor_barre_e_shape',
        name: 'E-Shape Barre',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 2,
          fingering: [2, 4, 4, 2, 2, 2],
          fingers: [1, 3, 4, 1, 1, 1],
          barres: [
            { fret: 2, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_csharp_minor',
    name: 'C# Minor',
    displayName: 'C#m',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Moody minor barre chord with a smooth timbre',
    commonIn: ['Key of E', 'Key of B', 'Pop', 'R&B'],
    variations: [
      {
        id: 'csharp_minor_barre_a_shape',
        name: 'A-Shape Barre',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 4,
          fingering: ['x', 4, 6, 6, 5, 4],
          fingers: [null, 1, 3, 4, 2, 1],
          barres: [
            { fret: 4, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },
  {
    id: 'guitar_gsharp_minor',
    name: 'G# Minor',
    displayName: 'G#m',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Dark, tense minor barre chord',
    commonIn: ['Key of B', 'Key of E', 'Rock', 'Alternative'],
    variations: [
      {
        id: 'gsharp_minor_barre_e_shape',
        name: 'E-Shape Barre',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 4,
          fingering: [4, 6, 6, 4, 4, 4],
          fingers: [1, 3, 4, 1, 1, 1],
          barres: [
            { fret: 4, fromString: 0, toString: 5, finger: 1 }
          ]
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
  // GUITAR - DOMINANT 9TH CHORDS
  // ============================================================================

  {
    id: 'guitar_c9',
    name: 'C Dominant 9',
    displayName: 'C9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Jazzy dominant 9th chord',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'c9_barre',
        name: 'Barre Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 3,
          fingering: ['x', 3, 2, 3, 3, 3],
          fingers: [null, 2, 1, 3, 3, 3]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_d9',
    name: 'D Dominant 9',
    displayName: 'D9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Bright dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'd9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 1, 'o'],
          fingers: [null, null, null, 2, 1, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_e9',
    name: 'E Dominant 9',
    displayName: 'E9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Full-bodied dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'e9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 'o', 1, 'o', 2],
          fingers: [null, 2, null, 1, null, 3]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_a9',
    name: 'A Dominant 9',
    displayName: 'A9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Bluesy dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'a9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 1, 'o', 'o'],
          fingers: [null, null, 2, 1, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_g9',
    name: 'G Dominant 9',
    displayName: 'G9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Rich dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'g9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [3, 'x', 'o', 2, 'o', 1],
          fingers: [3, null, null, 2, null, 1]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - 6TH CHORDS
  // ============================================================================

  {
    id: 'guitar_c6',
    name: 'C Major 6',
    displayName: 'C6',
    category: 'sixth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Vintage jazz chord',
    commonIn: ['Jazz', 'Swing', 'Pop'],
    variations: [
      {
        id: 'c6_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 2, 2, 1, 'o'],
          fingers: [null, 4, 2, 3, 1, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_d6',
    name: 'D Major 6',
    displayName: 'D6',
    category: 'sixth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Bright 6th chord',
    commonIn: ['Jazz', 'Swing', 'Country'],
    variations: [
      {
        id: 'd6_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 'o', 2],
          fingers: [null, null, null, 1, null, 2]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_e6',
    name: 'E Major 6',
    displayName: 'E6',
    category: 'sixth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Full 6th chord',
    commonIn: ['Jazz', 'Blues', 'Swing'],
    variations: [
      {
        id: 'e6_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 2, 1, 2, 'o'],
          fingers: [null, 2, 3, 1, 4, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_a6',
    name: 'A Major 6',
    displayName: 'A6',
    category: 'sixth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Sweet 6th chord',
    commonIn: ['Jazz', 'Country', 'Swing'],
    variations: [
      {
        id: 'a6_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 2, 2, 2],
          fingers: [null, null, 1, 1, 1, 1]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_g6',
    name: 'G Major 6',
    displayName: 'G6',
    category: 'sixth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Warm 6th chord',
    commonIn: ['Jazz', 'Folk', 'Swing'],
    variations: [
      {
        id: 'g6_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [3, 2, 'o', 'o', 'o', 'o'],
          fingers: [3, 2, null, null, null, null]
        } as GuitarChordPosition
      }
    ]
  },

  // ============================================================================
  // GUITAR - MINOR 9TH CHORDS
  // ============================================================================

  {
    id: 'guitar_am9',
    name: 'A Minor 9',
    displayName: 'Am9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Lush minor 9th - R&B staple',
    commonIn: ['R&B', 'Neo-soul', 'Jazz'],
    variations: [
      {
        id: 'am9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'o', 2, 4, 1, 3],
          fingers: [null, null, 2, 4, 1, 3]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_em9',
    name: 'E Minor 9',
    displayName: 'Em9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Dreamy minor 9th',
    commonIn: ['R&B', 'Pop', 'Jazz'],
    variations: [
      {
        id: 'em9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['o', 2, 'o', 'o', 'o', 2],
          fingers: [null, 1, null, null, null, 2]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_dm9',
    name: 'D Minor 9',
    displayName: 'Dm9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Smooth minor 9th',
    commonIn: ['R&B', 'Jazz', 'Pop'],
    variations: [
      {
        id: 'dm9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 'x', 'o', 2, 1, 'o'],
          fingers: [null, null, null, 2, 1, null]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_cm9',
    name: 'C Minor 9',
    displayName: 'Cm9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Dark minor 9th',
    commonIn: ['R&B', 'Jazz', 'Neo-soul'],
    variations: [
      {
        id: 'cm9_barre',
        name: 'Barre Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 3,
          fingering: ['x', 3, 1, 3, 3, 3],
          fingers: [null, 2, 1, 3, 3, 3]
        } as GuitarChordPosition
      }
    ]
  },

  {
    id: 'guitar_gm9',
    name: 'G Minor 9',
    displayName: 'Gm9',
    category: 'ninth',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Soulful minor 9th',
    commonIn: ['R&B', 'Jazz', 'Neo-soul'],
    variations: [
      {
        id: 'gm9_barre',
        name: 'Barre Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 3,
          fingering: [3, 1, 3, 3, 3, 3],
          fingers: [2, 1, 3, 3, 3, 3]
        } as GuitarChordPosition
      }
    ]
  },

  // Add these to the GUITAR section

  // Bb Major (A-shape barre at fret 1)
  {
    id: 'guitar_bb_major',
    name: 'Bb Major',
    displayName: 'Bb',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Common barre chord in pop, rock, and country keys',
    commonIn: ['Key of F', 'Key of Bb', 'Pop', 'Country'],
    variations: [
      {
        id: 'bb_major_barre_a_shape',
        name: 'A-Shape Barre',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 1, 3, 3, 3, 1],
          fingers: [null, 1, 2, 3, 4, 1],
          barres: [
            { fret: 1, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },

  // Bb Minor (A minor shape barre)
  {
    id: 'guitar_bbm_minor',
    name: 'Bb Minor',
    displayName: 'Bbm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Melancholic barre minor chord',
    commonIn: ['Key of Fm', 'Key of Bb minor', 'Ballads', 'Rock'],
    variations: [
      {
        id: 'bbm_minor_barre',
        name: 'Barre Chord (A minor shape)',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 1, 3, 3, 2, 1],
          fingers: [null, 1, 3, 4, 2, 1],
          barres: [
            { fret: 1, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },

  // F# Major (E-shape barre at fret 2)
  {
    id: 'guitar_fsharp_major',
    name: 'F# Major',
    displayName: 'F#',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Bright barre chord common in rock and transpositions',
    commonIn: ['Key of E', 'Key of B', 'Rock', 'Pop'],
    variations: [
      {
        id: 'fsharp_major_barre_e_shape',
        name: 'E-Shape Barre',
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

  // Easy / Partial F Major (very popular beginner workaround)
  {
    id: 'guitar_f_major_easy',
    name: 'F Major (Easy/Partial)',
    displayName: 'F (easy)',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Beginner-friendly partial barre - avoids full 6-string barre',
    commonIn: ['Key of C', 'Key of F', 'Pop', 'Folk'],
    variations: [
      {
        id: 'f_major_easy_partial',
        name: 'Partial F (133211 variant without low E)',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 3, 2, 1, 1],
          fingers: [null, 3, 4, 2, 1, 1],
          barres: [
            { fret: 1, fromString: 1, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },

  // Cadd9 (extremely common add9 shape in pop/rock)
  {
    id: 'guitar_cadd9',
    name: 'C add9',
    displayName: 'Cadd9',
    category: 'add',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Beautiful, dreamy add9 chord used in countless pop songs',
    commonIn: ['Pop', 'Rock', 'Acoustic', 'Key of C', 'Key of G'],
    variations: [
      {
        id: 'cadd9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: ['x', 3, 2, 'o', 3, 3],
          fingers: [null, 3, 2, null, 4, 1]
        } as GuitarChordPosition
      }
    ]
  },

  // Gadd9 (another super common add9)
  {
    id: 'guitar_gadd9',
    name: 'G add9',
    displayName: 'Gadd9',
    category: 'add',
    difficulty: 'beginner',
    instrument: 'guitar',
    description: 'Warm, ringing add9 shape - staple in modern acoustic playing',
    commonIn: ['Pop', 'Folk', 'Rock', 'Key of G', 'Key of D'],
    variations: [
      {
        id: 'gadd9_open',
        name: 'Open Position',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 1,
          fingering: [3, 2, 'o', 2, 'o', 3],
          fingers: [4, 2, null, 1, null, 3]
        } as GuitarChordPosition
      }
    ]
  },

  // B7 barre (E dominant 7 shape) - common in blues/rock
  {
    id: 'guitar_b7_barre',
    name: 'B Dominant 7 (barre)',
    displayName: 'B7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'guitar',
    description: 'Moveable dominant 7 barre shape - great for blues and rock',
    commonIn: ['Blues', 'Rock', 'Key of E'],
    variations: [
      {
        id: 'b7_barre_e_shape',
        name: 'E-Shape Barre at fret 7',
        isPrimary: true,
        positions: {
          type: 'guitar',
          strings: 6,
          frets: 4,
          baseFret: 7,
          fingering: [7, 9, 7, 8, 7, 7],
          fingers: [1, 3, 1, 2, 1, 1],
          barres: [
            { fret: 7, fromString: 0, toString: 5, finger: 1 }
          ]
        } as GuitarChordPosition
      }
    ]
  },

];
