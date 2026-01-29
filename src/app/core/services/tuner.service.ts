// src/app/core/services/tuner.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { PitchDetector } from 'pitchy';
import { TunerState, StringInfo, NoteInfo, TuningPreset } from '../models/tuner.model';
import { InstrumentService } from './instrument.service';
import { TUNING_PRESETS, getTuningsForInstrument, NOTE_NAMES } from '../config/tuner.config';

/**
 * TunerService - Audio-based instrument tuner
 * Uses Web Audio API for microphone access and Pitchy for pitch detection
 */
@Injectable({
  providedIn: 'root'
})
export class TunerService {
  private instrumentService = inject(InstrumentService);

  // Web Audio API
  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private mediaStream?: MediaStream;
  private animationId?: number;

  // Pitchy detector
  private pitchDetector?: PitchDetector<Float32Array<ArrayBuffer>>;
  private audioBuffer?: Float32Array<ArrayBuffer>;

  // Configuration
  private readonly A4_FREQUENCY = 440; // Standard tuning reference
  private readonly MIN_CLARITY = 0.95; // Confidence threshold (Pitchy returns 0-1)
  private readonly BUFFER_SIZE = 2048; // Pitchy works well with 2048
  private readonly SMOOTHING_FACTOR = 0.4; // For stable readings
  private readonly MIN_RMS = 0.01; // Silence threshold

  // State
  private tunerState = signal<TunerState>({
    isListening: false,
    currentFrequency: 0,
    detectedNote: '',
    detectedOctave: 0,
    cents: 0,
    clarity: 0
  });

  private selectedTuning = signal<TuningPreset | null>(null);
  private smoothedFrequency = 0;

  // Public readonly signals
  readonly state = this.tunerState.asReadonly();
  readonly currentTuning = this.selectedTuning.asReadonly();

  // Computed signals
  readonly isListening = computed(() => this.state().isListening);
  readonly isInTune = computed(() => Math.abs(this.state().cents) <= 5);
  readonly tuningStatus = computed(() => {
    const cents = this.state().cents;
    if (Math.abs(cents) <= 5) return 'in-tune';
    if (cents < 0) return 'flat';
    return 'sharp';
  });

  readonly availableTunings = computed<TuningPreset[]>(() => {
    const instrument = this.instrumentService.currentInstrument();
    return getTuningsForInstrument(instrument);
  });

  readonly closestString = computed<StringInfo | undefined>(() => {
    const tuning = this.currentTuning();
    const frequency = this.state().currentFrequency;

    if (!tuning || !tuning.strings.length || frequency === 0) return undefined;

    // Find closest string by frequency using reduce
    return tuning.strings.reduce((closest, string) => {
      const currentDiff = Math.abs(frequency - closest.frequency);
      const newDiff = Math.abs(frequency - string.frequency);
      return newDiff < currentDiff ? string : closest;
    }, tuning.strings[0]);
  });

  constructor() {
    // Set default tuning based on current instrument
    const instrument = this.instrumentService.currentInstrument();
    const defaultTuning = this.availableTunings()[0];
    if (defaultTuning) {
      this.selectedTuning.set(defaultTuning);
    }
  }

  /**
   * Start listening to microphone
   */
  async start(): Promise<void> {
    if (this.isListening()) {
      console.log('Tuner already listening');
      return;
    }

    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      // Setup Web Audio API
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.BUFFER_SIZE;
      this.analyser.smoothingTimeConstant = 0.8;

      source.connect(this.analyser);

      // Initialize Pitchy detector and buffer
      this.audioBuffer = new Float32Array(this.BUFFER_SIZE) as Float32Array<ArrayBuffer>;
      this.pitchDetector = PitchDetector.forFloat32Array(this.BUFFER_SIZE);
      this.pitchDetector.minVolumeDecibels = -30; // Ignore very quiet sounds

      // Start detection loop
      this.tunerState.update(state => ({ ...state, isListening: true }));
      this.detectPitch();

    } catch (error) {
      console.error('Failed to start tuner:', error);
      throw new Error('Microphone access denied or unavailable');
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = undefined;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = undefined;
    }

    this.analyser = undefined;
    this.pitchDetector = undefined;
    this.audioBuffer = undefined;
    this.smoothedFrequency = 0;

    this.tunerState.update(state => ({
      ...state,
      isListening: false,
      currentFrequency: 0,
      detectedNote: '',
      clarity: 0,
      cents: 0
    }));
  }

  /**
   * Main pitch detection loop using Pitchy
   */
  private detectPitch(): void {
    if (!this.isListening() || !this.analyser || !this.audioContext || !this.pitchDetector || !this.audioBuffer) {
      return;
    }

    // Get audio data
    this.analyser.getFloatTimeDomainData(this.audioBuffer);

    // Check for silence using RMS
    const rms = this.calculateRMS(this.audioBuffer);
    if (rms < this.MIN_RMS) {
      // Continue loop even if silent
      this.animationId = requestAnimationFrame(() => this.detectPitch());
      return;
    }

    // Detect pitch using Pitchy
    const [frequency, clarity] = this.pitchDetector.findPitch(
      this.audioBuffer,
      this.audioContext.sampleRate
    );

    // Only update if confidence is high and frequency is valid
    if (clarity >= this.MIN_CLARITY && frequency > 0) {
      // Validate frequency range (30 Hz to 4000 Hz for musical instruments)
      if (frequency >= 30 && frequency <= 4000) {
        // Smooth the frequency
        if (this.smoothedFrequency === 0) {
          this.smoothedFrequency = frequency;
        } else {
          this.smoothedFrequency =
            (this.smoothedFrequency * (1 - this.SMOOTHING_FACTOR)) +
            (frequency * this.SMOOTHING_FACTOR);
        }

        // Convert to note
        const noteInfo = this.frequencyToNote(this.smoothedFrequency);

        // Update state
        this.tunerState.update(state => ({
          ...state,
          currentFrequency: this.smoothedFrequency,
          detectedNote: noteInfo.note,
          detectedOctave: noteInfo.octave,
          cents: noteInfo.cents,
          clarity
        }));
      }
    }

    // Continue loop
    this.animationId = requestAnimationFrame(() => this.detectPitch());
  }

  /**
   * Calculate RMS (Root Mean Square) to detect silence
   */
  private calculateRMS(buffer: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }

  /**
   * Convert frequency to note information
   */
  private frequencyToNote(frequency: number): NoteInfo {
    // Calculate note number relative to A4 (440 Hz)
    const noteNum = 12 * (Math.log2(frequency / this.A4_FREQUENCY));
    const roundedNote = Math.round(noteNum);

    // Calculate cents (deviation from nearest note)
    const cents = Math.round((noteNum - roundedNote) * 100);

    // Get note name and octave
    const noteIndex = (roundedNote + 9 + 120) % 12; // +9 because A is index 9
    const octave = Math.floor((roundedNote + 9) / 12) + 4;

    // Validate note index
    if (noteIndex < 0 || noteIndex >= NOTE_NAMES.length) {
      return { note: 'Unknown', octave: 0, frequency, cents: 0 };
    }

    const note = NOTE_NAMES[noteIndex];

    return {
      note,
      octave,
      frequency,
      cents
    };
  }

  /**
   * Set tuning preset
   */
  setTuning(tuningId: string): void {
    const tuning = TUNING_PRESETS.find(t => t.id === tuningId);
    if (tuning) {
      this.selectedTuning.set(tuning);
      console.log('Tuning set to:', tuning.name);
    }
  }

  /**
   * Get frequency for a specific note
   */
  noteToFrequency(note: string, octave: number): number {
    const noteIndex = NOTE_NAMES.indexOf(note);
    if (noteIndex === -1) return 0;

    // A4 = 440 Hz, calculate relative to that
    const a4Index = 9; // A is at index 9
    const semitoneOffset = (octave - 4) * 12 + (noteIndex - a4Index);

    return this.A4_FREQUENCY * Math.pow(2, semitoneOffset / 12);
  }

  /**
   * Play reference tone with harmonics for realistic instrument sound
   */
  playReferenceTone(stringInfo: StringInfo, duration: number = 1000): void {
    try {
      // Create or reuse audio context for playback
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioContext();
      }

      const currentTime = this.audioContext.currentTime;
      const endTime = currentTime + duration / 1000;

      // Master gain node
      const masterGain = this.audioContext.createGain();
      masterGain.gain.value = 0.3;

      const instrument = this.instrumentService.currentInstrument();

      // Create fundamental frequency
      const fundamental = this.audioContext.createOscillator();
      const fundamentalGain = this.audioContext.createGain();

      // Configure based on instrument type
      switch (instrument) {
        case 'guitar':
        case 'bass':
          // Guitar/Bass: Rich harmonics with plucked string character
          fundamental.type = 'triangle';
          fundamental.frequency.value = stringInfo.frequency;
          fundamentalGain.gain.value = 0.6;
          fundamental.connect(fundamentalGain);
          fundamentalGain.connect(masterGain);

          // Add harmonics (2nd, 3rd, 4th, 5th)
          this.addHarmonic(stringInfo.frequency * 2, 0.3, 'sine', masterGain, endTime);  // Octave
          this.addHarmonic(stringInfo.frequency * 3, 0.2, 'sine', masterGain, endTime);  // Perfect fifth
          this.addHarmonic(stringInfo.frequency * 4, 0.15, 'sine', masterGain, endTime); // Two octaves
          this.addHarmonic(stringInfo.frequency * 5, 0.1, 'sine', masterGain, endTime);  // Major third

          // Add slight chorus/detune effect for realism
          const detune = this.audioContext.createOscillator();
          const detuneGain = this.audioContext.createGain();
          detune.type = 'triangle';
          detune.frequency.value = stringInfo.frequency;
          detune.detune.value = 3; // Slightly sharp
          detuneGain.gain.value = 0.15;
          detune.connect(detuneGain);
          detuneGain.connect(masterGain);
          detune.start(currentTime);
          detune.stop(endTime);

          // Pluck envelope - quick attack, medium decay
          fundamentalGain.gain.setValueAtTime(0.6, currentTime);
          fundamentalGain.gain.exponentialRampToValueAtTime(0.3, currentTime + 0.1);
          fundamentalGain.gain.exponentialRampToValueAtTime(0.01, endTime);
          break;

        case 'violin':
          // Violin: Bright, rich with many harmonics (bowed string)
          fundamental.type = 'sawtooth';
          fundamental.frequency.value = stringInfo.frequency;
          fundamentalGain.gain.value = 0.5;
          fundamental.connect(fundamentalGain);
          fundamentalGain.connect(masterGain);

          // Add more harmonics for brightness
          this.addHarmonic(stringInfo.frequency * 2, 0.35, 'sawtooth', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 3, 0.25, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 4, 0.2, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 5, 0.15, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 6, 0.1, 'sine', masterGain, endTime);

          // Sustained envelope (like bowing)
          fundamentalGain.gain.setValueAtTime(0, currentTime);
          fundamentalGain.gain.linearRampToValueAtTime(0.5, currentTime + 0.05); // Quick attack
          fundamentalGain.gain.setValueAtTime(0.5, endTime - 0.1); // Sustain
          fundamentalGain.gain.exponentialRampToValueAtTime(0.01, endTime); // Release
          break;

        case 'piano':
          // Piano: Complex harmonics with bell-like quality
          fundamental.type = 'triangle';
          fundamental.frequency.value = stringInfo.frequency;
          fundamentalGain.gain.value = 0.6;
          fundamental.connect(fundamentalGain);
          fundamentalGain.connect(masterGain);

          // Piano-like harmonic series
          this.addHarmonic(stringInfo.frequency * 2, 0.4, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 3, 0.25, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 4, 0.2, 'triangle', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 5, 0.15, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 6, 0.1, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 7, 0.08, 'sine', masterGain, endTime);

          // Add inharmonic partial for metallic quality
          this.addHarmonic(stringInfo.frequency * 6.27, 0.05, 'sine', masterGain, endTime);

          // Piano envelope - quick attack, long decay
          fundamentalGain.gain.setValueAtTime(0.6, currentTime);
          fundamentalGain.gain.exponentialRampToValueAtTime(0.01, endTime);
          break;

        default:
          // Default: Simple triangle wave with basic harmonics
          fundamental.type = 'triangle';
          fundamental.frequency.value = stringInfo.frequency;
          fundamentalGain.gain.value = 0.6;
          fundamental.connect(fundamentalGain);
          fundamentalGain.connect(masterGain);

          this.addHarmonic(stringInfo.frequency * 2, 0.3, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 3, 0.2, 'sine', masterGain, endTime);

          fundamentalGain.gain.exponentialRampToValueAtTime(0.01, endTime);
          break;
      }

      // Connect master gain to output
      masterGain.connect(this.audioContext.destination);

      // Start fundamental
      fundamental.start(currentTime);
      fundamental.stop(endTime);

    } catch (error) {
      console.error('Failed to play reference tone:', error);
      throw new Error('Audio playback unavailable');
    }
  }

  /**
   * Helper method to add harmonic overtones
   */
  private addHarmonic(
    frequency: number,
    gainValue: number,
    type: OscillatorType,
    destination: GainNode,
    endTime: number
  ): void {
    if (!this.audioContext) return;

    const currentTime = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;

    oscillator.connect(gain);
    gain.connect(destination);

    oscillator.start(currentTime);
    oscillator.stop(endTime);
  }

  /**
   * Format cents display
   */
  formatCents(cents: number): string {
    const sign = cents >= 0 ? '+' : '';
    return `${sign}${cents}`;
  }
}
