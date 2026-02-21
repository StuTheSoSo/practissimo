import { Injectable } from '@angular/core';
import {
  HarmonyDirection,
  HarmonyInterval,
  INTERVAL_TO_SEMITONES,
  NotePitch,
  PitchNote
} from '../models/pitch-finder.model';

@Injectable({
  providedIn: 'root'
})
export class PitchFinderService {
  private readonly A4_FREQUENCY = 440;
  private readonly MIN_OCTAVE = 0;
  private readonly MAX_OCTAVE = 8;
  private readonly NOTE_INDEX: Record<PitchNote, number> = {
    C: 0,
    'C#': 1,
    D: 2,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    Ab: 8,
    A: 9,
    Bb: 10,
    B: 11
  };
  private readonly NOTE_NAMES: PitchNote[] = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  private readonly visibilityHandler = () => {
    if (document.visibilityState !== 'visible') {
      this.stop();
    }
  };

  private audioContext: AudioContext | null = null;
  private activeOscillators = new Set<OscillatorNode>();
  private activeGains = new Set<GainNode>();
  private stopTimeoutId: number | null = null;

  constructor() {
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  playRoot(note: PitchNote, octave: number, durationMs?: number): NotePitch {
    const root = this.getNotePitch(note, octave);
    this.playFrequencies([root.frequency], durationMs);
    return root;
  }

  playHarmony(
    note: PitchNote,
    octave: number,
    interval: HarmonyInterval,
    direction: HarmonyDirection,
    durationMs?: number
  ): NotePitch {
    const root = this.getNotePitch(note, octave);
    const harmony = this.getHarmonyPitch(root, interval, direction);
    this.playFrequencies([harmony.frequency], durationMs);
    return harmony;
  }

  playTogether(
    note: PitchNote,
    octave: number,
    interval: HarmonyInterval,
    direction: HarmonyDirection,
    durationMs?: number
  ): { root: NotePitch; harmony: NotePitch } {
    const root = this.getNotePitch(note, octave);
    const harmony = this.getHarmonyPitch(root, interval, direction);
    this.playFrequencies([root.frequency, harmony.frequency], durationMs);
    return { root, harmony };
  }

  stop(): void {
    if (this.stopTimeoutId !== null) {
      window.clearTimeout(this.stopTimeoutId);
      this.stopTimeoutId = null;
    }

    const now = this.audioContext?.currentTime ?? 0;

    this.activeGains.forEach(gain => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0.0001, now, 0.02);
      } catch {
        // no-op
      }
    });

    this.activeOscillators.forEach(oscillator => {
      try {
        oscillator.stop(now + 0.08);
      } catch {
        // no-op
      }
      try {
        oscillator.disconnect();
      } catch {
        // no-op
      }
    });
    this.activeOscillators.clear();

    this.activeGains.forEach(gain => {
      try {
        gain.disconnect();
      } catch {
        // no-op
      }
    });
    this.activeGains.clear();
  }

  getNotePitch(note: PitchNote, octave: number): NotePitch {
    const clampedOctave = Math.max(this.MIN_OCTAVE, Math.min(this.MAX_OCTAVE, octave));
    const semitoneOffsetFromA4 = (clampedOctave - 4) * 12 + (this.NOTE_INDEX[note] - this.NOTE_INDEX.A);
    const frequency = this.A4_FREQUENCY * Math.pow(2, semitoneOffsetFromA4 / 12);

    return {
      note,
      octave: clampedOctave,
      frequency
    };
  }

  getHarmonyPitch(root: NotePitch, interval: HarmonyInterval, direction: HarmonyDirection): NotePitch {
    const semitones = INTERVAL_TO_SEMITONES[interval] * (direction === 'below' ? -1 : 1);
    const rootMidi = this.noteToMidi(root.note, root.octave);
    const harmonyMidi = rootMidi + semitones;
    return this.midiToNotePitch(harmonyMidi);
  }

  private playFrequencies(frequencies: number[], durationMs?: number): void {
    this.stop();
    this.ensureAudioContext();

    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const attackEnd = now + 0.02;

    frequencies.forEach((frequency, idx) => {
      const oscillator = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      oscillator.type = idx === 0 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, attackEnd);

      oscillator.connect(gain);
      gain.connect(this.audioContext!.destination);

      oscillator.start(now);
      this.activeOscillators.add(oscillator);
      this.activeGains.add(gain);

      oscillator.onended = () => {
        this.activeOscillators.delete(oscillator);
        this.activeGains.delete(gain);
        try {
          oscillator.disconnect();
          gain.disconnect();
        } catch {
          // no-op
        }
      };
    });

    if (durationMs && durationMs > 0) {
      this.stopTimeoutId = window.setTimeout(() => this.stop(), durationMs);
    }
  }

  private noteToMidi(note: PitchNote, octave: number): number {
    return (octave + 1) * 12 + this.NOTE_INDEX[note];
  }

  private midiToNotePitch(midi: number): NotePitch {
    const clampedMidi = Math.max(12, Math.min(119, midi));
    const noteIndex = ((clampedMidi % 12) + 12) % 12;
    const octave = Math.floor(clampedMidi / 12) - 1;
    const note = this.NOTE_NAMES[noteIndex];
    const frequency = this.A4_FREQUENCY * Math.pow(2, (clampedMidi - 69) / 12);

    return { note, octave, frequency };
  }

  private ensureAudioContext(): void {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.audioContext.state === 'suspended') {
      void this.audioContext.resume();
    }
  }
}
