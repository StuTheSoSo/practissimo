// src/app/core/config/chord-library/piano-chords.config.ts
import { Chord } from '../../models/chord.model';

export const PIANO_CHORDS: Chord[] = [
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
  {
    id: 'piano_db_major',
    name: 'Db Major',
    displayName: 'Db',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Lush major chord with five flats',
    commonIn: ['Key of Db', 'Romantic', 'Film'],
    variations: [
      {
        id: 'piano_db_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Db', octave: 4, finger: 1 },
            { note: 'F', octave: 4, finger: 3 },
            { note: 'Ab', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_fsharp_major',
    name: 'F# Major',
    displayName: 'F#',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Brilliant major chord with six sharps',
    commonIn: ['Key of F#', 'Bright pop', 'Classical'],
    variations: [
      {
        id: 'piano_fsharp_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F#', octave: 3, finger: 1 },
            { note: 'A#', octave: 3, finger: 3 },
            { note: 'C#', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_ab_major',
    name: 'Ab Major',
    displayName: 'Ab',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Warm major chord with four flats',
    commonIn: ['Key of Ab', 'Key of Eb', 'Ballads'],
    variations: [
      {
        id: 'piano_ab_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Ab', octave: 3, finger: 1 },
            { note: 'C', octave: 4, finger: 3 },
            { note: 'Eb', octave: 4, finger: 5 }
          ],
          octave: 3
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
  },
  // ============================================================================
  // PIANO - MAJOR CHORDS (completing the basics)
  // ============================================================================

  {
    id: 'piano_bb_major',
    name: 'Bb Major',
    displayName: 'Bb',
    category: 'major',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Warm major chord with two flats - common in pop and ballads',
    commonIn: ['Key of F', 'Key of Bb', 'Pop', 'Soul'],
    variations: [
      {
        id: 'piano_bb_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Bb', octave: 3, finger: 1 },
            { note: 'D', octave: 4, finger: 3 },
            { note: 'F', octave: 4, finger: 5 }
          ],
          octave: 3  // Starting lower for comfortable hand position
        }
      }
    ]
  },

  {
    id: 'piano_eb_major',
    name: 'Eb Major',
    displayName: 'Eb',
    category: 'major',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Rich major chord with three flats - staple in ballads and gospel',
    commonIn: ['Key of Eb', 'Key of Ab', 'Ballads', 'Gospel'],
    variations: [
      {
        id: 'piano_eb_major_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Eb', octave: 3, finger: 2 },
            { note: 'G', octave: 3, finger: 1 },
            { note: 'Bb', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - MINOR CHORDS (completing the diatonic set)
  // ============================================================================

  {
    id: 'piano_cm_minor',
    name: 'C Minor',
    displayName: 'Cm',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Dark, emotional minor chord - all white keys except Eb',
    commonIn: ['Key of Eb', 'Key of Cm', 'Pop ballads', 'Classical'],
    variations: [
      {
        id: 'piano_cm_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'Eb', octave: 4, finger: 3 },
            { note: 'G', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_fm_minor',
    name: 'F Minor',
    displayName: 'Fm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Melancholic minor chord with four flats',
    commonIn: ['Key of Ab', 'Key of Fm', 'Ballads', 'R&B'],
    variations: [
      {
        id: 'piano_fm_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F', octave: 3, finger: 1 },
            { note: 'Ab', octave: 3, finger: 3 },
            { note: 'C', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_gm_minor',
    name: 'G Minor',
    displayName: 'Gm',
    category: 'minor',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Soulful minor chord - common in rock and pop',
    commonIn: ['Key of Bb', 'Key of Gm', 'Rock', 'Pop'],
    variations: [
      {
        id: 'piano_gm_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'G', octave: 3, finger: 1 },
            { note: 'Bb', octave: 3, finger: 3 },
            { note: 'D', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_bbm_minor',
    name: 'Bb Minor',
    displayName: 'Bbm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Somber minor chord with five flats',
    commonIn: ['Key of Db', 'R&B', 'Film'],
    variations: [
      {
        id: 'piano_bbm_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Bb', octave: 3, finger: 1 },
            { note: 'Db', octave: 4, finger: 3 },
            { note: 'F', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_bm_minor',
    name: 'B Minor',
    displayName: 'Bm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Brooding minor chord with two sharps',
    commonIn: ['Key of D', 'Key of Bm', 'Rock', 'Classical'],
    variations: [
      {
        id: 'piano_bm_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'B', octave: 3, finger: 1 },
            { note: 'D', octave: 4, finger: 3 },
            { note: 'F#', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_csharp_minor',
    name: 'C# Minor',
    displayName: 'C#m',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Expressive minor chord with four sharps',
    commonIn: ['Key of E', 'Key of A', 'Pop'],
    variations: [
      {
        id: 'piano_csharp_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C#', octave: 4, finger: 1 },
            { note: 'E', octave: 4, finger: 3 },
            { note: 'G#', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },
  {
    id: 'piano_ebm_minor',
    name: 'Eb Minor',
    displayName: 'Ebm',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Deep minor chord with six flats',
    commonIn: ['Key of Gb', 'Neo-soul', 'Film'],
    variations: [
      {
        id: 'piano_ebm_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Eb', octave: 3, finger: 1 },
            { note: 'Gb', octave: 3, finger: 3 },
            { note: 'Bb', octave: 3, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_fsharp_minor',
    name: 'F# Minor',
    displayName: 'F#m',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Moody minor chord with three sharps',
    commonIn: ['Key of A', 'Key of E', 'Pop', 'Rock'],
    variations: [
      {
        id: 'piano_fsharp_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F#', octave: 3, finger: 1 },
            { note: 'A', octave: 3, finger: 3 },
            { note: 'C#', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_gsharp_minor',
    name: 'G# Minor',
    displayName: 'G#m',
    category: 'minor',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Tense minor chord with five sharps',
    commonIn: ['Key of B', 'Key of E', 'Rock', 'Pop'],
    variations: [
      {
        id: 'piano_gsharp_minor_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'G#', octave: 3, finger: 1 },
            { note: 'B', octave: 3, finger: 3 },
            { note: 'D#', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - MINOR 7TH CHORDS (very common in pop, jazz, R&B)
  // ============================================================================

  {
    id: 'piano_am7',
    name: 'A Minor 7',
    displayName: 'Am7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Smooth, jazzy minor seventh - extremely common in pop',
    commonIn: ['Pop', 'R&B', 'Jazz', 'Key of C', 'Key of G'],
    variations: [
      {
        id: 'piano_am7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'A', octave: 3, finger: 1 },
            { note: 'C', octave: 4, finger: 2 },
            { note: 'E', octave: 4, finger: 3 },
            { note: 'G', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_dm7',
    name: 'D Minor 7',
    displayName: 'Dm7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Mellow minor seventh - backbone of ii–V–I progressions',
    commonIn: ['Jazz', 'Pop', 'Blues', 'Key of C', 'Key of G'],
    variations: [
      {
        id: 'piano_dm7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 3, finger: 1 },
            { note: 'F', octave: 3, finger: 2 },
            { note: 'A', octave: 3, finger: 4 },
            { note: 'C', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_em7',
    name: 'E Minor 7',
    displayName: 'Em7',
    category: 'seventh',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Open-sounding minor seventh - great for ballads',
    commonIn: ['Pop', 'Rock', 'Folk', 'Key of D', 'Key of G'],
    variations: [
      {
        id: 'piano_em7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'E', octave: 3, finger: 1 },
            { note: 'G', octave: 3, finger: 2 },
            { note: 'B', octave: 3, finger: 4 },
            { note: 'D', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - MORE DOMINANT 7TH & MAJOR 7TH
  // ============================================================================

  {
    id: 'piano_f7',
    name: 'F Dominant 7',
    displayName: 'F7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Bluesy dominant seventh - resolves strongly to Bb',
    commonIn: ['Blues', 'Jazz', 'Key of Bb', 'Key of F'],
    variations: [
      {
        id: 'piano_f7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F', octave: 3, finger: 1 },
            { note: 'A', octave: 3, finger: 2 },
            { note: 'C', octave: 4, finger: 3 },
            { note: 'Eb', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_fmaj7',
    name: 'F Major 7',
    displayName: 'Fmaj7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Dreamy major seventh - popular in pop and bossa nova',
    commonIn: ['Jazz', 'Bossa Nova', 'Pop ballads', 'Key of F'],
    variations: [
      {
        id: 'piano_fmaj7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F', octave: 3, finger: 1 },
            { note: 'A', octave: 3, finger: 2 },
            { note: 'C', octave: 4, finger: 3 },
            { note: 'E', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_a7',
    name: 'A Dominant 7',
    displayName: 'A7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Classic dominant seventh - common in blues turnarounds',
    commonIn: ['Blues', 'Rock', 'Key of D'],
    variations: [
      {
        id: 'piano_a7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'A', octave: 3, finger: 1 },
            { note: 'C#', octave: 4, finger: 2 },
            { note: 'E', octave: 4, finger: 3 },
            { note: 'G', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_d7',
    name: 'D Dominant 7',
    displayName: 'D7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Strong dominant seventh - resolves to G',
    commonIn: ['Blues', 'Jazz', 'Key of G'],
    variations: [
      {
        id: 'piano_d7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 3, finger: 1 },
            { note: 'F#', octave: 3, finger: 2 },
            { note: 'A', octave: 3, finger: 3 },
            { note: 'C', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
    id: 'piano_gmaj7',
    name: 'G Major 7',
    displayName: 'Gmaj7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Silky major seventh with a bright, airy sound',
    commonIn: ['Jazz', 'Bossa Nova', 'Key of G'],
    variations: [
      {
        id: 'piano_gmaj7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'G', octave: 3, finger: 1 },
            { note: 'B', octave: 3, finger: 2 },
            { note: 'D', octave: 4, finger: 3 },
            { note: 'F#', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },
  {
  id: 'piano_e7',
  name: 'E Dominant 7',
  displayName: 'E7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Strong dominant seventh - resolves to A',
  commonIn: ['Blues', 'Jazz', 'Key of A'],
  variations: [
    {
      id: 'piano_e7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'E', octave: 3, finger: 1 },
          { note: 'G#', octave: 3, finger: 2 },
          { note: 'B', octave: 3, finger: 3 },
          { note: 'D', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - B7
{
  id: 'piano_b7',
  name: 'B Dominant 7',
  displayName: 'B7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Sharp dominant seventh - resolves to E',
  commonIn: ['Blues', 'Jazz', 'Key of E'],
  variations: [
    {
      id: 'piano_b7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'B', octave: 3, finger: 1 },
          { note: 'D#', octave: 4, finger: 2 },
          { note: 'F#', octave: 4, finger: 3 },
          { note: 'A', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Amaj7
{
  id: 'piano_amaj7',
  name: 'A Major 7',
  displayName: 'Amaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Bright, sophisticated major seventh',
  commonIn: ['Jazz', 'Pop', 'Bossa Nova', 'Key of A'],
  variations: [
    {
      id: 'piano_amaj7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'A', octave: 3, finger: 1 },
          { note: 'C#', octave: 4, finger: 2 },
          { note: 'E', octave: 4, finger: 3 },
          { note: 'G#', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Dmaj7
{
  id: 'piano_dmaj7',
  name: 'D Major 7',
  displayName: 'Dmaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Sweet, dreamy major seventh',
  commonIn: ['Jazz', 'Pop', 'Key of D'],
  variations: [
    {
      id: 'piano_dmaj7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'D', octave: 3, finger: 1 },
          { note: 'F#', octave: 3, finger: 2 },
          { note: 'A', octave: 3, finger: 3 },
          { note: 'C#', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Emaj7
{
  id: 'piano_emaj7',
  name: 'E Major 7',
  displayName: 'Emaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Warm major seventh',
  commonIn: ['Jazz', 'R&B', 'Key of E'],
  variations: [
    {
      id: 'piano_emaj7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'E', octave: 3, finger: 1 },
          { note: 'G#', octave: 3, finger: 2 },
          { note: 'B', octave: 3, finger: 4 },
          { note: 'D#', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Bmaj7
{
  id: 'piano_bmaj7',
  name: 'B Major 7',
  displayName: 'Bmaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Shimmering major seventh',
  commonIn: ['Jazz', 'Pop', 'Key of B'],
  variations: [
    {
      id: 'piano_bmaj7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'B', octave: 3, finger: 1 },
          { note: 'D#', octave: 4, finger: 2 },
          { note: 'F#', octave: 4, finger: 3 },
          { note: 'A#', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Bm7
{
  id: 'piano_bm7',
  name: 'B Minor 7',
  displayName: 'Bm7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Melancholic minor seventh',
  commonIn: ['Pop', 'Jazz', 'Key of D', 'Key of A'],
  variations: [
    {
      id: 'piano_bm7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'B', octave: 3, finger: 1 },
          { note: 'D', octave: 4, finger: 2 },
          { note: 'F#', octave: 4, finger: 4 },
          { note: 'A', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Cm7
{
  id: 'piano_cm7',
  name: 'C Minor 7',
  displayName: 'Cm7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Dark minor seventh',
  commonIn: ['Jazz', 'Blues', 'Key of Bb'],
  variations: [
    {
      id: 'piano_cm7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'C', octave: 3, finger: 1 },
          { note: 'Eb', octave: 3, finger: 2 },
          { note: 'G', octave: 3, finger: 4 },
          { note: 'Bb', octave: 3, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Fm7
{
  id: 'piano_fm7',
  name: 'F Minor 7',
  displayName: 'Fm7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Somber minor seventh',
  commonIn: ['Jazz', 'R&B', 'Key of Ab'],
  variations: [
    {
      id: 'piano_fm7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'F', octave: 3, finger: 1 },
          { note: 'Ab', octave: 3, finger: 2 },
          { note: 'C', octave: 4, finger: 4 },
          { note: 'Eb', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Gm7
{
  id: 'piano_gm7',
  name: 'G Minor 7',
  displayName: 'Gm7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Soulful minor seventh',
  commonIn: ['Jazz', 'R&B', 'Key of Bb', 'Key of F'],
  variations: [
    {
      id: 'piano_gm7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'G', octave: 3, finger: 1 },
          { note: 'Bb', octave: 3, finger: 2 },
          { note: 'D', octave: 4, finger: 4 },
          { note: 'F', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Bbmaj7
{
  id: 'piano_bbmaj7',
  name: 'Bb Major 7',
  displayName: 'Bbmaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Smooth, jazzy major seventh',
  commonIn: ['Jazz', 'R&B', 'Key of Bb'],
  variations: [
    {
      id: 'piano_bbmaj7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'Bb', octave: 3, finger: 1 },
          { note: 'D', octave: 4, finger: 2 },
          { note: 'F', octave: 4, finger: 3 },
          { note: 'A', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Ebmaj7
{
  id: 'piano_ebmaj7',
  name: 'Eb Major 7',
  displayName: 'Ebmaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Rich, luxurious major seventh',
  commonIn: ['Jazz', 'R&B', 'Key of Eb'],
  variations: [
    {
      id: 'piano_ebmaj7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'Eb', octave: 3, finger: 1 },
          { note: 'G', octave: 3, finger: 2 },
          { note: 'Bb', octave: 3, finger: 3 },
          { note: 'D', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
},

// PIANO - Abmaj7
{
  id: 'piano_abmaj7',
  name: 'Ab Major 7',
  displayName: 'Abmaj7',
  category: 'seventh',
  difficulty: 'intermediate',
  instrument: 'piano',
  description: 'Warm, velvety major seventh',
  commonIn: ['Jazz', 'R&B', 'Key of Ab'],
  variations: [
    {
      id: 'piano_abmaj7_root',
      name: 'Root Position',
      isPrimary: true,
      positions: {
        type: 'piano',
        notes: [
          { note: 'Ab', octave: 3, finger: 1 },
          { note: 'C', octave: 4, finger: 2 },
          { note: 'Eb', octave: 4, finger: 3 },
          { note: 'G', octave: 4, finger: 5 }
        ],
        octave: 3
      }
    }
  ]
  },

  // ============================================================================
  // PIANO - MORE DOMINANT 7TH CHORDS
  // ============================================================================

  {
    id: 'piano_fsharp7',
    name: 'F# Dominant 7',
    displayName: 'F#7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Sharp dominant seventh',
    commonIn: ['Blues', 'Jazz', 'Key of B'],
    variations: [
      {
        id: 'piano_fsharp7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F#', octave: 3, finger: 1 },
            { note: 'A#', octave: 3, finger: 2 },
            { note: 'C#', octave: 4, finger: 3 },
            { note: 'E', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_bb7',
    name: 'Bb Dominant 7',
    displayName: 'Bb7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Bluesy flat seventh',
    commonIn: ['Blues', 'Jazz', 'Key of Eb'],
    variations: [
      {
        id: 'piano_bb7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Bb', octave: 3, finger: 1 },
            { note: 'D', octave: 4, finger: 2 },
            { note: 'F', octave: 4, finger: 3 },
            { note: 'Ab', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_eb7',
    name: 'Eb Dominant 7',
    displayName: 'Eb7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Dark dominant seventh',
    commonIn: ['Blues', 'Jazz', 'Key of Ab'],
    variations: [
      {
        id: 'piano_eb7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Eb', octave: 3, finger: 1 },
            { note: 'G', octave: 3, finger: 2 },
            { note: 'Bb', octave: 3, finger: 3 },
            { note: 'Db', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_ab7',
    name: 'Ab Dominant 7',
    displayName: 'Ab7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Rich dominant seventh',
    commonIn: ['Blues', 'Jazz', 'Key of Db'],
    variations: [
      {
        id: 'piano_ab7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Ab', octave: 3, finger: 1 },
            { note: 'C', octave: 4, finger: 2 },
            { note: 'Eb', octave: 4, finger: 3 },
            { note: 'Gb', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_db7',
    name: 'Db Dominant 7',
    displayName: 'Db7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Flat dominant seventh',
    commonIn: ['Blues', 'Jazz', 'Key of Gb'],
    variations: [
      {
        id: 'piano_db7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Db', octave: 4, finger: 1 },
            { note: 'F', octave: 4, finger: 2 },
            { note: 'Ab', octave: 4, finger: 3 },
            { note: 'Cb', octave: 5, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - MORE MINOR 7TH CHORDS
  // ============================================================================

  {
    id: 'piano_fsharp_m7',
    name: 'F# Minor 7',
    displayName: 'F#m7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Moody minor seventh',
    commonIn: ['Jazz', 'Pop', 'Key of A'],
    variations: [
      {
        id: 'piano_fsharp_m7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'F#', octave: 3, finger: 1 },
            { note: 'A', octave: 3, finger: 2 },
            { note: 'C#', octave: 4, finger: 4 },
            { note: 'E', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_gsharp_m7',
    name: 'G# Minor 7',
    displayName: 'G#m7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Tense minor seventh',
    commonIn: ['Jazz', 'Pop', 'Key of B'],
    variations: [
      {
        id: 'piano_gsharp_m7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'G#', octave: 3, finger: 1 },
            { note: 'B', octave: 3, finger: 2 },
            { note: 'D#', octave: 4, finger: 4 },
            { note: 'F#', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_csharp_m7',
    name: 'C# Minor 7',
    displayName: 'C#m7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Expressive minor seventh',
    commonIn: ['Jazz', 'Pop', 'Key of E'],
    variations: [
      {
        id: 'piano_csharp_m7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C#', octave: 4, finger: 1 },
            { note: 'E', octave: 4, finger: 2 },
            { note: 'G#', octave: 4, finger: 4 },
            { note: 'B', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_ebm7',
    name: 'Eb Minor 7',
    displayName: 'Ebm7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Deep minor seventh',
    commonIn: ['Jazz', 'Neo-soul', 'Key of Gb'],
    variations: [
      {
        id: 'piano_ebm7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Eb', octave: 3, finger: 1 },
            { note: 'Gb', octave: 3, finger: 2 },
            { note: 'Bb', octave: 3, finger: 4 },
            { note: 'Db', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_bbm7',
    name: 'Bb Minor 7',
    displayName: 'Bbm7',
    category: 'seventh',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Somber minor seventh',
    commonIn: ['Jazz', 'R&B', 'Key of Db'],
    variations: [
      {
        id: 'piano_bbm7_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'Bb', octave: 3, finger: 1 },
            { note: 'Db', octave: 4, finger: 2 },
            { note: 'F', octave: 4, finger: 4 },
            { note: 'Ab', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - DOMINANT 9TH CHORDS
  // ============================================================================

  {
    id: 'piano_c9',
    name: 'C Dominant 9',
    displayName: 'C9',
    category: 'ninth',
    difficulty: 'advanced',
    instrument: 'piano',
    description: 'Jazzy dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'piano_c9_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 3, finger: 1 },
            { note: 'E', octave: 3, finger: 2 },
            { note: 'Bb', octave: 3, finger: 4 },
            { note: 'D', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_d9',
    name: 'D Dominant 9',
    displayName: 'D9',
    category: 'ninth',
    difficulty: 'advanced',
    instrument: 'piano',
    description: 'Bright dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'piano_d9_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 3, finger: 1 },
            { note: 'F#', octave: 3, finger: 2 },
            { note: 'C', octave: 4, finger: 4 },
            { note: 'E', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_e9',
    name: 'E Dominant 9',
    displayName: 'E9',
    category: 'ninth',
    difficulty: 'advanced',
    instrument: 'piano',
    description: 'Full-bodied dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'piano_e9_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'E', octave: 3, finger: 1 },
            { note: 'G#', octave: 3, finger: 2 },
            { note: 'D', octave: 4, finger: 4 },
            { note: 'F#', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_g9',
    name: 'G Dominant 9',
    displayName: 'G9',
    category: 'ninth',
    difficulty: 'advanced',
    instrument: 'piano',
    description: 'Rich dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'piano_g9_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'G', octave: 3, finger: 1 },
            { note: 'B', octave: 3, finger: 2 },
            { note: 'F', octave: 4, finger: 4 },
            { note: 'A', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  {
    id: 'piano_a9',
    name: 'A Dominant 9',
    displayName: 'A9',
    category: 'ninth',
    difficulty: 'advanced',
    instrument: 'piano',
    description: 'Bluesy dominant 9th',
    commonIn: ['Jazz', 'Blues', 'Funk'],
    variations: [
      {
        id: 'piano_a9_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'A', octave: 3, finger: 1 },
            { note: 'C#', octave: 4, finger: 2 },
            { note: 'G', octave: 4, finger: 4 },
            { note: 'B', octave: 4, finger: 5 }
          ],
          octave: 3
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - SUSPENDED CHORDS
  // ============================================================================

  {
    id: 'piano_csus2',
    name: 'C Suspended 2',
    displayName: 'Csus2',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Open, airy suspended chord',
    commonIn: ['Pop', 'Rock', 'Ambient'],
    variations: [
      {
        id: 'piano_csus2_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'D', octave: 4, finger: 2 },
            { note: 'G', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_csus4',
    name: 'C Suspended 4',
    displayName: 'Csus4',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Tension and resolution',
    commonIn: ['Pop', 'Rock', 'Folk'],
    variations: [
      {
        id: 'piano_csus4_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'F', octave: 4, finger: 3 },
            { note: 'G', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_dsus2',
    name: 'D Suspended 2',
    displayName: 'Dsus2',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Bright suspended chord',
    commonIn: ['Pop', 'Folk', 'Ambient'],
    variations: [
      {
        id: 'piano_dsus2_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 4, finger: 1 },
            { note: 'E', octave: 4, finger: 2 },
            { note: 'A', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_dsus4',
    name: 'D Suspended 4',
    displayName: 'Dsus4',
    category: 'suspended',
    difficulty: 'beginner',
    instrument: 'piano',
    description: 'Classic suspended chord',
    commonIn: ['Pop', 'Folk', 'Rock'],
    variations: [
      {
        id: 'piano_dsus4_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 4, finger: 1 },
            { note: 'G', octave: 4, finger: 3 },
            { note: 'A', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - DIMINISHED CHORDS
  // ============================================================================

  {
    id: 'piano_cdim',
    name: 'C Diminished',
    displayName: 'Cdim',
    category: 'diminished',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Tense, unstable chord',
    commonIn: ['Jazz', 'Classical', 'Film'],
    variations: [
      {
        id: 'piano_cdim_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'Eb', octave: 4, finger: 3 },
            { note: 'Gb', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_ddim',
    name: 'D Diminished',
    displayName: 'Ddim',
    category: 'diminished',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Dissonant diminished chord',
    commonIn: ['Jazz', 'Classical', 'Blues'],
    variations: [
      {
        id: 'piano_ddim_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 4, finger: 1 },
            { note: 'F', octave: 4, finger: 3 },
            { note: 'Ab', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_edim',
    name: 'E Diminished',
    displayName: 'Edim',
    category: 'diminished',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Dramatic diminished chord',
    commonIn: ['Jazz', 'Classical', 'Film'],
    variations: [
      {
        id: 'piano_edim_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'E', octave: 4, finger: 1 },
            { note: 'G', octave: 4, finger: 3 },
            { note: 'Bb', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  // ============================================================================
  // PIANO - AUGMENTED CHORDS
  // ============================================================================

  {
    id: 'piano_caug',
    name: 'C Augmented',
    displayName: 'Caug',
    category: 'augmented',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Mysterious, dreamlike chord',
    commonIn: ['Jazz', 'Film', 'Experimental'],
    variations: [
      {
        id: 'piano_caug_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'C', octave: 4, finger: 1 },
            { note: 'E', octave: 4, finger: 3 },
            { note: 'G#', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_daug',
    name: 'D Augmented',
    displayName: 'Daug',
    category: 'augmented',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Unstable augmented chord',
    commonIn: ['Jazz', 'Film', 'Classical'],
    variations: [
      {
        id: 'piano_daug_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'D', octave: 4, finger: 1 },
            { note: 'F#', octave: 4, finger: 3 },
            { note: 'A#', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  },

  {
    id: 'piano_eaug',
    name: 'E Augmented',
    displayName: 'Eaug',
    category: 'augmented',
    difficulty: 'intermediate',
    instrument: 'piano',
    description: 'Tense augmented chord',
    commonIn: ['Jazz', 'Film', 'Experimental'],
    variations: [
      {
        id: 'piano_eaug_root',
        name: 'Root Position',
        isPrimary: true,
        positions: {
          type: 'piano',
          notes: [
            { note: 'E', octave: 4, finger: 1 },
            { note: 'G#', octave: 4, finger: 3 },
            { note: 'B#', octave: 4, finger: 5 }
          ],
          octave: 4
        }
      }
    ]
  }
];
