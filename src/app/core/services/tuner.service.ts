// src/app/core/services/tuner.service.ts
import { Injectable, signal, computed, inject, effect, OnDestroy } from '@angular/core';
import * as Tone from 'tone';
import { TunerState, StringInfo, NoteInfo, TuningPreset } from '../models/tuner.model';
import { InstrumentService } from './instrument.service';
import { TUNING_PRESETS, getTuningsForInstrument, NOTE_NAMES } from '../config/tuner.config';

/**
 * TunerService - Audio-based instrument tuner
 * Uses Tone.js for audio input and autocorrelation for pitch detection
 */
@Injectable({
  providedIn: 'root'
})
export class TunerService implements OnDestroy {
  private instrumentService = inject(InstrumentService);

  // Tone.js Audio
  private audioContext?: AudioContext;
  private analyser?: Tone.Analyser;
  private userMedia?: Tone.UserMedia;
  private animationId?: number;
  private highPassFilter?: Tone.Filter;
  private lowPassFilter?: Tone.Filter;
  private inputGain?: Tone.Gain;
  private audioBuffer?: Float32Array<ArrayBuffer>;

  // Configuration
  private customA4Frequency = signal<number>(440); // Configurable tuning reference
  private readonly MIN_CLARITY = 0.9; // Base confidence threshold (0-1)
  private readonly BUFFER_SIZE = 16384; // Larger buffer improves low-frequency accuracy
  private readonly SMOOTHING_FACTOR = 0.25; // For stable readings
  private readonly MIN_RMS = 0.0005; // Silence threshold (lower for iOS mic levels)
  private readonly LOW_STRING_FREQUENCY = 180; // Hz threshold for low strings
  private readonly HISTORY_SIZE = 7;
  private readonly TUNING_HISTORY_SIZE = 30; // Keep last 30 readings for trends

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
  private tuningHistory: number[] = []; // Track cents over time for trends
  private readonly visibilityHandler = () => this.handleVisibilityChange();

  // Performance optimization: reuse normalized buffer
  private normalizedBuffer?: Float32Array;

  // Public readonly signals
  readonly state = this.tunerState.asReadonly();
  readonly currentTuning = this.selectedTuning.asReadonly();
  readonly a4Frequency = this.customA4Frequency.asReadonly();

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

    // First, check if detected frequency might be a harmonic (octave error)
    const possibleFundamental = frequency / 2;
    const possibleSecondHarmonic = frequency / 3;
    
    // Find closest string considering potential octave errors
    let bestMatch = tuning.strings[0];
    let bestDiff = Math.abs(frequency - bestMatch.frequency);
    
    for (const string of tuning.strings) {
      // Check fundamental frequency
      const directDiff = Math.abs(frequency - string.frequency);
      
      // Check if detected frequency is an octave (2x) of the target
      const octaveDiff = Math.abs(possibleFundamental - string.frequency);
      
      // Check if detected frequency is 3rd harmonic (3x) of the target
      const thirdHarmonicDiff = Math.abs(possibleSecondHarmonic - string.frequency);
      
      // Use the smallest difference
      const minDiff = Math.min(directDiff, octaveDiff, thirdHarmonicDiff);
      
      if (minDiff < bestDiff) {
        bestDiff = minDiff;
        bestMatch = string;
      }
    }
    
    // Additional validation: if the best match is still far off, it might be a harmonic issue
    // For high strings (>250 Hz), be more tolerant of octave detection
    const tolerance = bestMatch.frequency > 250 ? 50 : 30; // Hz
    
    if (bestDiff > tolerance) {
      // Likely detecting a harmonic - try to find the actual fundamental
      const fundamentalCandidate = frequency / 2;
      const closestToFundamental = tuning.strings.reduce((closest, string) => {
        const currentDiff = Math.abs(fundamentalCandidate - closest.frequency);
        const newDiff = Math.abs(fundamentalCandidate - string.frequency);
        return newDiff < currentDiff ? string : closest;
      }, tuning.strings[0]);
      
      const fundamentalDiff = Math.abs(fundamentalCandidate - closestToFundamental.frequency);
      if (fundamentalDiff < tolerance) {
        return closestToFundamental;
      }
    }
    
    return bestMatch;
  });

  // New: Tuning trend analysis
  readonly tuningTrend = computed<'improving' | 'stable' | 'worsening' | 'unknown'>(() => {
    if (this.tuningHistory.length < 10) return 'unknown';
    
    const recent = this.tuningHistory.slice(-10);
    const older = this.tuningHistory.slice(-20, -10);
    
    if (older.length === 0) return 'unknown';
    
    const recentAvg = recent.reduce((sum, val) => sum + Math.abs(val), 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + Math.abs(val), 0) / older.length;
    
    const threshold = 2; // 2 cents difference threshold
    
    if (recentAvg < olderAvg - threshold) return 'improving';
    if (recentAvg > olderAvg + threshold) return 'worsening';
    return 'stable';
  });

  // New: Auto-tuning suggestion based on consistent sharp/flat readings
  readonly tuningSuggestion = computed<'tighten' | 'loosen' | 'good' | null>(() => {
    if (!this.isListening() || this.tuningHistory.length < 15) return null;
    
    const recent = this.tuningHistory.slice(-15);
    const avgCents = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const consistency = recent.filter(val => Math.sign(val) === Math.sign(avgCents)).length / recent.length;
    
    // Need 80% consistency and at least 8 cents off
    if (consistency < 0.8 || Math.abs(avgCents) < 8) return null;
    
    if (Math.abs(avgCents) <= 5) return 'good';
    return avgCents > 0 ? 'loosen' : 'tighten'; // Sharp = loosen, Flat = tighten
  });

  constructor() {
    document.addEventListener('visibilitychange', this.visibilityHandler);
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
   * Cleanup on service destroy - fixes memory leak
   */
  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.stop();
  }

  /**
   * Set custom A4 reference frequency (e.g., 442 Hz for orchestral tuning)
   */
  setA4Frequency(frequency: number): void {
    if (frequency < 400 || frequency > 480) {
      throw new Error('A4 frequency must be between 400 and 480 Hz');
    }
    this.customA4Frequency.set(frequency);
    
    // Recalculate current note if listening
    if (this.isListening() && this.state().currentFrequency > 0) {
      const noteInfo = this.frequencyToNote(this.state().currentFrequency);
      this.tunerState.update(state => ({
        ...state,
        detectedNote: noteInfo.note,
        detectedOctave: noteInfo.octave,
        cents: noteInfo.cents
      }));
    }
  }

  /**
   * Get tuning history for visualization
   */
  getTuningHistory(): ReadonlyArray<number> {
    return [...this.tuningHistory];
  }

  /**
   * Clear tuning history
   */
  clearTuningHistory(): void {
    this.tuningHistory = [];
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
      await Tone.start();
      this.audioContext = Tone.getContext().rawContext as AudioContext;

      // Request microphone access via Tone.js
      this.userMedia = new Tone.UserMedia();
      await this.userMedia.open();

      // Input gain to boost low-level iOS mic signals
      this.inputGain = new Tone.Gain(2.0);

      // Filter chain to reduce noise and improve low-string detection
      this.highPassFilter = new Tone.Filter(55, 'highpass');
      this.lowPassFilter = new Tone.Filter(1200, 'lowpass');

      this.analyser = new Tone.Analyser('waveform', this.BUFFER_SIZE);
      this.analyser.smoothing = 0.3; // Reduced from 0.6 for better high-string response

      this.userMedia.connect(this.inputGain);
      this.inputGain.connect(this.highPassFilter);
      this.highPassFilter.connect(this.lowPassFilter);
      this.lowPassFilter.connect(this.analyser);

      // Initialize buffers
      this.audioBuffer = new Float32Array(new ArrayBuffer(this.BUFFER_SIZE * 4));
      this.normalizedBuffer = new Float32Array(this.BUFFER_SIZE); // Reusable buffer

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

    if (this.userMedia) {
      this.userMedia.close();
      this.userMedia.dispose();
      this.userMedia = undefined;
    }

    if (this.highPassFilter) {
      this.highPassFilter.dispose();
      this.highPassFilter = undefined;
    }

    if (this.lowPassFilter) {
      this.lowPassFilter.dispose();
      this.lowPassFilter = undefined;
    }

    if (this.inputGain) {
      this.inputGain.dispose();
      this.inputGain = undefined;
    }

    if (this.analyser) {
      this.analyser.dispose();
      this.analyser = undefined;
    }

    this.audioContext = undefined;
    this.audioBuffer = undefined;
    this.normalizedBuffer = undefined;
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

  private handleVisibilityChange(): void {
    if (!this.isListening() || !this.audioContext) return;
    if (document.visibilityState !== 'visible') return;

    if (this.audioContext.state === 'suspended') {
      void this.audioContext.resume();
    }
  }

  /**
   * Main pitch detection loop using autocorrelation
   */
  private detectPitch(): void {
    if (!this.isListening() || !this.analyser || !this.audioContext || !this.audioBuffer) {
      return;
    }

    // Get audio data
    const waveform = this.analyser.getValue() as Float32Array;
    if (waveform?.length === this.audioBuffer.length) {
      this.audioBuffer.set(waveform);
    } else if (waveform?.length) {
      const len = Math.min(waveform.length, this.audioBuffer.length);
      this.audioBuffer.set(waveform.subarray(0, len));
    }

    // Check for silence using RMS (do not early-return; iOS often reports low levels)
    const rms = this.calculateRMS(this.audioBuffer);

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

    // Autocorrelation result
    if (autoResult && autoResult.frequency >= 30 && autoResult.frequency <= 4000) {
      const autoMinClarity = this.getAdaptiveClarity(autoResult.frequency);
      if (autoResult.clarity >= autoMinClarity * 0.7) {
        const correctedFrequency = this.correctOctaveError(autoResult.frequency, autoResult.clarity);
        this.updateTunerState(correctedFrequency, autoResult.clarity);
      }
    }

    // Continue loop
    this.animationId = requestAnimationFrame(() => this.detectPitch());
  }

  /**
   * Correct potential octave errors (detecting harmonics instead of fundamental)
   * This is common with high strings where the 2nd harmonic is stronger than fundamental
   */
  private correctOctaveError(frequency: number, clarity: number): number {
    // Only apply correction for frequencies above 250 Hz (typical high string territory)
    if (frequency < 250) return frequency;
    
    const tuning = this.selectedTuning();
    if (!tuning || !tuning.strings.length) return frequency;
    
    // Check if half the frequency (octave below) matches a string better
    const halfFreq = frequency / 2;
    const thirdFreq = frequency / 3;
    
    // Find closest string to detected frequency
    const directMatch = tuning.strings.reduce((closest, string) => {
      const currentDiff = Math.abs(frequency - closest.frequency);
      const newDiff = Math.abs(frequency - string.frequency);
      return newDiff < currentDiff ? string : closest;
    }, tuning.strings[0]);
    
    // Find closest string to half frequency (potential fundamental)
    const octaveMatch = tuning.strings.reduce((closest, string) => {
      const currentDiff = Math.abs(halfFreq - closest.frequency);
      const newDiff = Math.abs(halfFreq - string.frequency);
      return newDiff < currentDiff ? string : closest;
    }, tuning.strings[0]);
    
    const directDiff = Math.abs(frequency - directMatch.frequency);
    const octaveDiff = Math.abs(halfFreq - octaveMatch.frequency);
    
    // If half frequency is much closer to a string, we're likely detecting the octave
    // Use a threshold: if octave match is more than 2x better, use it
    if (octaveDiff < directDiff * 0.4 && octaveDiff < 15) {
      console.log(`Octave correction: ${frequency.toFixed(1)}Hz -> ${halfFreq.toFixed(1)}Hz (detected harmonic)`);
      return halfFreq;
    }
    
    return frequency;
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

    // Update tuning history for trend analysis
    this.tuningHistory.push(noteInfo.cents);
    if (this.tuningHistory.length > this.TUNING_HISTORY_SIZE) {
      this.tuningHistory.shift();
    }

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
   * Adaptive clarity threshold for different frequency ranges
   */
  private getAdaptiveClarity(frequency: number): number {
    if (frequency <= 0) return this.MIN_CLARITY;
    
    // Low frequencies (bass strings) - more lenient
    if (frequency < 90) return 0.75;
    if (frequency < this.LOW_STRING_FREQUENCY) return 0.85;
    
    // High frequencies (treble strings) - stricter to avoid harmonic confusion
    if (frequency > 400) return 0.93;
    if (frequency > 300) return 0.91;
    
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
   * Autocorrelation pitch detection for low strings (optimized)
   * Returns frequency and a normalized clarity estimate (0-1)
   */
  private autoCorrelate(buffer: Float32Array, sampleRate: number): { frequency: number; clarity: number } | null {
    const size = buffer.length;
    const minLag = Math.floor(sampleRate / 4000);
    const maxLag = Math.floor(sampleRate / 30);

    // Calculate mean
    let mean = 0;
    for (let i = 0; i < size; i++) {
      mean += buffer[i];
    }
    mean /= size;

    // Normalize and calculate RMS using reusable buffer (performance optimization)
    let rms = 0;
    const normalized = this.normalizedBuffer!; // Already allocated
    for (let i = 0; i < size; i++) {
      const value = buffer[i] - mean;
      normalized[i] = value;
      rms += value * value;
    }
    rms = Math.sqrt(rms / size);
    if (rms < this.MIN_RMS) return null;

    let bestLag = -1;
    let bestCorrelation = 0;

    // Main autocorrelation loop
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
    const A4 = this.customA4Frequency(); // Use configurable A4 frequency
    
    // Calculate note number relative to A4 (A4 = note 0)
    const noteNum = 12 * (Math.log2(frequency / A4));
    const roundedNote = Math.round(noteNum);

    // Calculate cents (deviation from nearest note)
    const cents = Math.round((noteNum - roundedNote) * 100);

    // Calculate octave
    const octaveFromA4 = Math.floor((roundedNote + 9) / 12);
    const octave = 4 + octaveFromA4;
    
    // Find the note index
    // Check if NOTE_NAMES starts with 'A' or 'C'
    // Most configs start with A: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    // Some start with C: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    
    let noteIndex: number;
    if (NOTE_NAMES[0] === 'A') {
      // Array starts with A, so A4 is at index 0
      noteIndex = roundedNote % 12;
      if (noteIndex < 0) noteIndex += 12;
    } else {
      // Array starts with C, so A4 is at index 9
      noteIndex = ((roundedNote % 12) + 9) % 12;
      if (noteIndex < 0) noteIndex += 12;
    }

    // Validate note index
    if (noteIndex < 0 || noteIndex >= NOTE_NAMES.length) {
      console.error('Invalid note index:', noteIndex, 'NOTE_NAMES length:', NOTE_NAMES.length);
      console.error('NOTE_NAMES:', NOTE_NAMES);
      return { note: 'Unknown', octave: 0, frequency, cents: 0 };
    }

    const note = NOTE_NAMES[noteIndex];
    
    // Debug logging to help diagnose issues
    if (frequency > 300 && frequency < 350) { // High E range
      console.log(`High E debug: freq=${frequency.toFixed(1)}Hz, semitones=${roundedNote}, noteIndex=${noteIndex}, note=${note}${octave}, NOTE_NAMES[0]=${NOTE_NAMES[0]}`);
    }
    if (frequency > 190 && frequency < 205) { // G string range
      console.log(`G string debug: freq=${frequency.toFixed(1)}Hz, semitones=${roundedNote}, noteIndex=${noteIndex}, note=${note}${octave}, NOTE_NAMES[0]=${NOTE_NAMES[0]}`);
    }

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
    const A4 = this.customA4Frequency(); // Use configurable A4 frequency
    const noteIndex = NOTE_NAMES.indexOf(note);
    if (noteIndex === -1) return 0;

    // A4 = configured frequency, calculate relative to that
    const a4Index = 9; // A is at index 9
    const semitoneOffset = (octave - 4) * 12 + (noteIndex - a4Index);

    return A4 * Math.pow(2, semitoneOffset / 12);
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
