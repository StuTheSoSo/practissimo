// src/app/core/services/tuner.service.ts
import { Injectable, signal, computed, inject, effect } from '@angular/core';
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
  private highPassFilter?: BiquadFilterNode;
  private lowPassFilter?: BiquadFilterNode;

  // Pitchy detector
  private pitchDetector?: PitchDetector<Float32Array<ArrayBuffer>>;
  private audioBuffer?: Float32Array<ArrayBuffer>;

  // Configuration
  private readonly A4_FREQUENCY = 440; // Standard tuning reference
  private readonly MIN_CLARITY = 0.9; // Base confidence threshold (Pitchy returns 0-1)
  private readonly BUFFER_SIZE = 16384; // Larger buffer improves low-frequency accuracy
  private readonly SMOOTHING_FACTOR = 0.25; // For stable readings
  private readonly MIN_RMS = 0.003; // Silence threshold
  private readonly LOW_STRING_FREQUENCY = 180; // Hz threshold for low strings
  private readonly HISTORY_SIZE = 7;

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
  private frequencyHistory: number[] = [];

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
    effect(() => {
      const instrument = this.instrumentService.currentInstrument();
      const tunings = getTuningsForInstrument(instrument);
      const current = this.selectedTuning();

      if (tunings.length === 0) {
        if (this.isListening()) {
          this.stop();
        }
        this.selectedTuning.set(null);
        return;
      }

      if (!current || current.instrument !== instrument) {
        this.selectedTuning.set(tunings[0]);
      }
    });
  }

  /**
   * Start listening to microphone
   */
  async start(): Promise<void> {
    if (this.isListening()) {
      return;
    }

    if (this.availableTunings().length === 0) {
      throw new Error('Tuner is not available for this instrument');
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

      // Filter chain to reduce noise and improve low-string detection
      this.highPassFilter = this.audioContext.createBiquadFilter();
      this.highPassFilter.type = 'highpass';
      this.highPassFilter.frequency.value = 55;

      this.lowPassFilter = this.audioContext.createBiquadFilter();
      this.lowPassFilter.type = 'lowpass';
      this.lowPassFilter.frequency.value = 1200;

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.BUFFER_SIZE;
      this.analyser.smoothingTimeConstant = 0.6;

      source.connect(this.highPassFilter);
      this.highPassFilter.connect(this.lowPassFilter);
      this.lowPassFilter.connect(this.analyser);

      // Initialize Pitchy detector and buffer
      this.audioBuffer = new Float32Array(this.BUFFER_SIZE) as Float32Array<ArrayBuffer>;
      this.pitchDetector = PitchDetector.forFloat32Array(this.BUFFER_SIZE);
      this.pitchDetector.minVolumeDecibels = -45; // Allow quieter sounds

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

    this.highPassFilter = undefined;
    this.lowPassFilter = undefined;
    this.analyser = undefined;
    this.pitchDetector = undefined;
    this.audioBuffer = undefined;
    this.smoothedFrequency = 0;
    this.frequencyHistory = [];

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

    const autoResult = this.autoCorrelate(this.audioBuffer, this.audioContext.sampleRate);
    const preferAuto = !!autoResult && autoResult.frequency < this.LOW_STRING_FREQUENCY;

    if (preferAuto && autoResult) {
      const autoMinClarity = this.getAdaptiveClarity(autoResult.frequency);
      if (autoResult.clarity >= autoMinClarity * 0.7) {
        this.updateTunerState(autoResult.frequency, autoResult.clarity);
        this.animationId = requestAnimationFrame(() => this.detectPitch());
        return;
      }
    }

    // Detect pitch using Pitchy
    const [frequency, clarity] = this.pitchDetector.findPitch(
      this.audioBuffer,
      this.audioContext.sampleRate
    );

    const minClarity = this.getAdaptiveClarity(frequency);

    // Only update if confidence is high and frequency is valid
    if (clarity >= minClarity && frequency > 0) {
      // Validate frequency range (30 Hz to 4000 Hz for musical instruments)
      if (frequency >= 30 && frequency <= 4000) {
        this.updateTunerState(frequency, clarity);
      }
    } else if (autoResult && autoResult.frequency >= 30 && autoResult.frequency <= 4000) {
      const autoMinClarity = this.getAdaptiveClarity(autoResult.frequency);
      if (autoResult.clarity >= autoMinClarity * 0.7) {
        this.updateTunerState(autoResult.frequency, autoResult.clarity);
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
   * Update tuner state with smoothing
   */
  private updateTunerState(frequency: number, clarity: number): void {
    const stableFrequency = this.applyFrequencySmoothing(frequency);
    const noteInfo = this.frequencyToNote(stableFrequency);

    this.tunerState.update(state => ({
      ...state,
      currentFrequency: stableFrequency,
      detectedNote: noteInfo.note,
      detectedOctave: noteInfo.octave,
      cents: noteInfo.cents,
      clarity
    }));
  }

  /**
   * Adaptive clarity threshold for low strings
   */
  private getAdaptiveClarity(frequency: number): number {
    if (frequency <= 0) return this.MIN_CLARITY;
    if (frequency < 90) return 0.75;
    if (frequency < this.LOW_STRING_FREQUENCY) return 0.85;
    return this.MIN_CLARITY;
  }

  private applyFrequencySmoothing(frequency: number): number {
    if (frequency <= 0) return this.smoothedFrequency;

    this.frequencyHistory.push(frequency);
    if (this.frequencyHistory.length > this.HISTORY_SIZE) {
      this.frequencyHistory.shift();
    }

    const sorted = [...this.frequencyHistory].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    if (this.smoothedFrequency === 0) {
      this.smoothedFrequency = median;
      return this.smoothedFrequency;
    }

    const delta = median - this.smoothedFrequency;
    const maxStep = this.smoothedFrequency < this.LOW_STRING_FREQUENCY ? 6 : 12;
    const limited =
      Math.abs(delta) > maxStep
        ? this.smoothedFrequency + Math.sign(delta) * maxStep
        : median;

    this.smoothedFrequency =
      (this.smoothedFrequency * (1 - this.SMOOTHING_FACTOR)) +
      (limited * this.SMOOTHING_FACTOR);

    return this.smoothedFrequency;
  }

  /**
   * Autocorrelation pitch detection for low strings
   * Returns frequency and a normalized clarity estimate (0-1)
   */
  private autoCorrelate(buffer: Float32Array, sampleRate: number): { frequency: number; clarity: number } | null {
    const size = buffer.length;
    const minLag = Math.floor(sampleRate / 4000);
    const maxLag = Math.floor(sampleRate / 30);

    let rms = 0;
    let mean = 0;
    for (let i = 0; i < size; i++) {
      mean += buffer[i];
    }
    mean /= size;

    const normalized = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      const value = buffer[i] - mean;
      normalized[i] = value;
      rms += value * value;
    }
    rms = Math.sqrt(rms / size);
    if (rms < this.MIN_RMS) return null;

    let bestLag = -1;
    let bestCorrelation = 0;

    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < size - lag; i++) {
        sum += normalized[i] * normalized[i + lag];
      }
      const correlation = sum / (size - lag);
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestLag = lag;
      }
    }

    if (bestLag === -1) return null;

    // Parabolic interpolation around best lag for better accuracy
    const prevLag = Math.max(minLag, bestLag - 1);
    const nextLag = Math.min(maxLag, bestLag + 1);
    const prev = this.autocorrelationAtLag(normalized, prevLag);
    const curr = this.autocorrelationAtLag(normalized, bestLag);
    const next = this.autocorrelationAtLag(normalized, nextLag);

    const denom = (prev - 2 * curr + next);
    const shift = denom !== 0 ? 0.5 * (prev - next) / denom : 0;
    const refinedLag = bestLag + shift;

    const frequency = sampleRate / refinedLag;
    const clarity = Math.min(Math.max(bestCorrelation / (rms * rms), 0), 1);

    return { frequency, clarity };
  }

  private autocorrelationAtLag(buffer: Float32Array, lag: number): number {
    let sum = 0;
    for (let i = 0; i < buffer.length - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    return sum / (buffer.length - lag);
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
