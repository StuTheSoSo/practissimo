// src/app/core/services/tuner.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { TunerState, StringInfo, NoteInfo, TuningPreset } from '../models/tuner.model';
import { InstrumentService } from './instrument.service';
import { TUNING_PRESETS, getTuningsForInstrument, NOTE_NAMES } from '../config/tuner.config';

/**
 * TunerService - Audio-based instrument tuner
 * Uses Web Audio API for microphone access and pitch detection
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

  // Configuration
  private readonly A4_FREQUENCY = 440; // Standard tuning reference
  private readonly MIN_CLARITY = 0.92; // Confidence threshold
  private readonly BUFFER_SIZE = 4096; // Larger for low frequencies (bass)
  private readonly SMOOTHING_FACTOR = 0.4; // For stable readings

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

    if (!tuning || frequency === 0) return undefined;

    // Find closest string by frequency
    let closest = tuning.strings[0];
    let minDiff = Math.abs(frequency - closest.frequency);

    for (const string of tuning.strings) {
      const diff = Math.abs(frequency - string.frequency);
      if (diff < minDiff) {
        minDiff = diff;
        closest = string;
      }
    }

    return closest;
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
   * Main pitch detection loop
   */
  private detectPitch(): void {
    if (!this.isListening() || !this.analyser || !this.audioContext) {
      return;
    }

    // Get audio data
    const buffer = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buffer);

    // Detect pitch using autocorrelation
    const [frequency, clarity] = this.autoCorrelate(buffer, this.audioContext.sampleRate);

    // Only update if confidence is high
    if (clarity >= this.MIN_CLARITY && frequency > 0) {
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
        clarity,
        targetNote: this.closestString()
      }));
    }

    // Continue loop
    this.animationId = requestAnimationFrame(() => this.detectPitch());
  }

  /**
   * Autocorrelation pitch detection algorithm
   */
  private autoCorrelate(buffer: Float32Array, sampleRate: number): [number, number] {
    // Calculate RMS (Root Mean Square) to detect silence
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);

    // If too quiet, return no pitch
    if (rms < 0.01) {
      return [0, 0];
    }

    // Autocorrelation
    const correlations = new Array(buffer.length).fill(0);

    for (let lag = 0; lag < buffer.length; lag++) {
      for (let i = 0; i < buffer.length - lag; i++) {
        correlations[lag] += buffer[i] * buffer[i + lag];
      }
    }

    // Find the first peak after the initial dip
    let foundStart = false;
    let peakValue = 0;
    let peakIndex = 0;

    for (let i = 1; i < correlations.length; i++) {
      if (!foundStart && correlations[i] < 0) {
        foundStart = true;
      }

      if (foundStart && correlations[i] > peakValue) {
        peakValue = correlations[i];
        peakIndex = i;
      }
    }

    // Calculate clarity (confidence)
    const clarity = peakValue / correlations[0];

    // Calculate frequency
    const frequency = sampleRate / peakIndex;

    // Validate frequency range (30 Hz to 4000 Hz)
    if (frequency < 30 || frequency > 4000) {
      return [0, 0];
    }

    return [frequency, clarity];
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
   * Play reference tone
   */
  playReferenceTone(stringInfo: StringInfo, duration: number = 1000): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = stringInfo.frequency;

    gainNode.gain.value = 0.3;
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  /**
   * Format cents display
   */
  formatCents(cents: number): string {
    const sign = cents >= 0 ? '+' : '';
    return `${sign}${cents}`;
  }
}
