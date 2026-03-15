// src/app/core/config/tuner-samples.config.ts

/**
 * Reference-tone samples for the tuner "String Guide".
 *
 * Paths are relative to the app root and should live under `src/assets/`.
 * Place your `.m4a` files under `src/assets/audio/tuner/` (or update these paths).
 */
export const TUNER_GUITAR_REFERENCE_SAMPLES_BY_OCTAVE: Record<string, Record<number, string>> = {
  C: {
    3: 'assets/audio/tuner/gtr_c3_pick.m4a',
    4: 'assets/audio/tuner/gtr_c4_pick.m4a',
    5: 'assets/audio/tuner/gtr_c5_pick.m4a'
  },
  E: {
    2: 'assets/audio/tuner/gtr_e2_pick.m4a',
    3: 'assets/audio/tuner/gtr_e3_pick.m4a',
    4: 'assets/audio/tuner/gtr_e4_pick.m4a',
    5: 'assets/audio/tuner/gtr_e5_pick.m4a'
  },
  'G#': {
    2: 'assets/audio/tuner/gtr_gs2_pick.m4a',
    3: 'assets/audio/tuner/gtr_gs3_pick.m4a',
    4: 'assets/audio/tuner/gtr_gs4_pick.m4a',
    5: 'assets/audio/tuner/gtr_gs5_pick.m4a'
  },
  // Optional enharmonic alias
  Ab: {
    2: 'assets/audio/tuner/gtr_gs2_pick.m4a',
    3: 'assets/audio/tuner/gtr_gs3_pick.m4a',
    4: 'assets/audio/tuner/gtr_gs4_pick.m4a',
    5: 'assets/audio/tuner/gtr_gs5_pick.m4a'
  }
};
