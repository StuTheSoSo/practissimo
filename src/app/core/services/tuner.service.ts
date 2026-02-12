// src/app/core/services/tuner.service.ts
import { Injectable, signal, computed, inject, effect, OnDestroy } from '@angular/core';
import { TunerState, StringInfo, NoteInfo, TuningPreset } from '../models/tuner.model';
import { InstrumentService } from './instrument.service';
import { TUNING_PRESETS, getTuningsForInstrument, NOTE_NAMES } from '../config/tuner.config';

/**
 * TunerService - Audio-based instrument tuner
 * Uses native WebAudio input and autocorrelation for pitch detection
 */
@Injectable({
  providedIn: 'root'
})
export class TunerService implements OnDestroy {
  private instrumentService = inject(InstrumentService);

  // Audio input
  private audioContext?: AudioContext;
  private playbackContext?: AudioContext; // FIX: Separate context for playback
  private nativeStream?: MediaStream;
  private nativeSource?: MediaStreamAudioSourceNode;
  private nativeAnalyser?: AnalyserNode;
  private animationId?: number;
  private audioBuffer?: Float32Array<ArrayBuffer>;
  private activeOscillators: Set<OscillatorNode> = new Set(); // FIX: Track active oscillators

  // Configuration
  private customA4Frequency = signal<number>(440); // Configurable tuning reference
  private readonly MIN_CLARITY = 0.9; // Base confidence threshold (0-1)
  private readonly BUFFER_SIZE = 16384; // Larger buffer improves low-frequency accuracy
  private readonly SMOOTHING_FACTOR = 0.12; // For stable readings
  private readonly ADAPTIVE_SMOOTHING_FACTOR = 0.25; // For rapid changes
  private readonly MIN_RMS = 0.0012; // Silence threshold after normalization
  private readonly VERY_LOW_RMS = 0.00018; // Startup/base gate for ambient noise
  private readonly LOW_STRING_FREQUENCY = 180; // Hz threshold for low strings
  private readonly IN_TUNE_TOLERANCE_CENTS = 15; // Less twitchy "in tune" target
  private readonly CENTS_DEAD_ZONE = 3; // Treat tiny drift as centered
  private readonly CENTS_SMOOTHING_FACTOR = 0.22; // Smooth cents UI updates
  private readonly STARTUP_STABILIZATION_MS = 1200;
  private readonly NOTE_LOCK_FRAMES_STARTUP = 5;
  private readonly NOTE_LOCK_FRAMES_STEADY = 2;
  private readonly NOISE_SAMPLE_WINDOW = 40;
  private readonly HISTORY_SIZE = 7;
  private readonly TUNING_HISTORY_SIZE = 30; // Keep last 30 readings for trends
  private readonly DEBUG_MODE = false; // FIX: Debug flag instead of hardcoded logs

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
  private smoothedCents = 0;
  private frequencyHistory: number[] = [];
  private tuningHistory: number[] = []; // Track cents over time for trends
  private sessionStartTime = 0;
  private rmsNoiseSamples: number[] = [];
  private candidateNoteKey = '';
  private candidateNoteFrames = 0;
  private acceptedNoteKey = '';
  private readonly visibilityHandler = () => this.handleVisibilityChange();

  // Performance optimization: reuse normalized buffer
  private normalizedBuffer?: Float32Array;

  // Public readonly signals
  readonly state = this.tunerState.asReadonly();
  readonly currentTuning = this.selectedTuning.asReadonly();
  readonly a4Frequency = this.customA4Frequency.asReadonly();

  // Computed signals
  readonly isListening = computed(() => this.state().isListening);
  readonly isInTune = computed(() => Math.abs(this.state().cents) <= this.IN_TUNE_TOLERANCE_CENTS);
  readonly tuningStatus = computed(() => {
    const cents = this.state().cents;
    if (Math.abs(cents) <= this.IN_TUNE_TOLERANCE_CENTS) return 'in-tune';
    if (cents < 0) return 'flat';
    return 'sharp';
  });

  readonly availableTunings = computed<TuningPreset[]>(() => {
    const instrument = this.instrumentService.currentInstrument();
    return getTuningsForInstrument(instrument);
  });

  // FIX: Simplified closestString - removed octave correction logic (now in detection pipeline)
  readonly closestString = computed<StringInfo | undefined>(() => {
    const tuning = this.currentTuning();
    const frequency = this.state().currentFrequency;

    if (!tuning || !tuning.strings.length || frequency === 0) return undefined;

    // Find closest string to detected frequency
    let bestMatch = tuning.strings[0];
    let bestDiff = Math.abs(frequency - bestMatch.frequency);
    
    for (const string of tuning.strings) {
      const diff = Math.abs(frequency - string.frequency);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = string;
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
    this.stopAllOscillators(); // FIX: Stop any playing oscillators
    
    // FIX: Clean up playback context
    if (this.playbackContext) {
      this.playbackContext.close();
      this.playbackContext = undefined;
    }
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
      await this.ensureMicrophonePermission();
      this.audioContext = new AudioContext();
      await this.setupNativeInput();

      // Initialize buffers
      this.audioBuffer = new Float32Array(new ArrayBuffer(this.BUFFER_SIZE * 4));
      this.normalizedBuffer = new Float32Array(this.BUFFER_SIZE); // Reusable buffer
      this.sessionStartTime = performance.now();
      this.rmsNoiseSamples = [];
      this.candidateNoteKey = '';
      this.candidateNoteFrames = 0;
      this.acceptedNoteKey = '';

      // Start detection loop
      this.tunerState.update(state => ({ ...state, isListening: true }));
      this.detectPitch();

    } catch (error) {
      const normalized = this.normalizeError(
        error,
        'Microphone access denied or unavailable'
      );
      console.error('Failed to start tuner:', normalized.message, error);
      throw normalized;
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    // FIX: Cancel animation frame FIRST to prevent race condition
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }

    if (this.nativeStream) {
      this.nativeStream.getTracks().forEach(track => track.stop());
      this.nativeStream = undefined;
    }

    if (this.nativeSource) {
      this.nativeSource.disconnect();
      this.nativeSource = undefined;
    }

    if (this.nativeAnalyser) {
      this.nativeAnalyser.disconnect();
      this.nativeAnalyser = undefined;
    }

    // FIX: Close audio context instead of just setting to undefined
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = undefined;
    }

    this.audioBuffer = undefined;
    this.normalizedBuffer = undefined;
    this.smoothedFrequency = 0;
    this.smoothedCents = 0;
    this.frequencyHistory = [];
    this.sessionStartTime = 0;
    this.rmsNoiseSamples = [];
    this.candidateNoteKey = '';
    this.candidateNoteFrames = 0;
    this.acceptedNoteKey = '';

    this.tunerState.update(state => ({
      ...state,
      isListening: false,
      currentFrequency: 0,
      detectedNote: '',
      clarity: 0,
      cents: 0
    }));
  }

  private async ensureMicrophonePermission(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone access unavailable: missing getUserMedia');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      const normalized = this.normalizeError(
        error,
        'Microphone access failed: UnknownError'
      );
      throw new Error(normalized.message);
    }
  }

  private async setupNativeInput(): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Native input failed: missing audio context');
    }

    try {
      this.nativeStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.nativeSource = this.audioContext.createMediaStreamSource(this.nativeStream);
      this.nativeAnalyser = this.audioContext.createAnalyser();
      this.nativeAnalyser.fftSize = this.BUFFER_SIZE;
      this.nativeAnalyser.smoothingTimeConstant = 0.9;
      this.nativeSource.connect(this.nativeAnalyser);
    } catch (error) {
      const normalized = this.normalizeError(error, 'Native input failed');
      throw new Error(`Native input failed: ${normalized.message}`);
    }
  }

  private normalizeError(error: unknown, fallbackMessage: string): Error {
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === 'string') {
      return new Error(error);
    }
    if (error && typeof error === 'object') {
      const possibleMessage = (error as { message?: string }).message;
      const possibleName = (error as { name?: string }).name;
      if (possibleMessage) {
        return new Error(possibleMessage);
      }
      if (possibleName) {
        return new Error(`Microphone access failed: ${possibleName}`);
      }
      try {
        return new Error(JSON.stringify(error));
      } catch {
        return new Error(fallbackMessage);
      }
    }
    return new Error(fallbackMessage);
  }

  // FIX: Added async and error handling
  private async handleVisibilityChange(): Promise<void> {
    if (!this.isListening() || !this.audioContext) return;
    if (document.visibilityState !== 'visible') return;

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        // Optionally restart the tuner
        this.stop();
      }
    }
  }

  /**
   * Main pitch detection loop using autocorrelation
   */
  private detectPitch(): void {
    // FIX: Check at the start to prevent race condition
    if (!this.isListening() || !this.audioContext || !this.audioBuffer || !this.nativeAnalyser) {
      return;
    }

    // Get audio data
    this.nativeAnalyser.getFloatTimeDomainData(this.audioBuffer);

    // FIX: Use RMS check with very low threshold for iOS
    const rms = this.calculateRMS(this.audioBuffer);
    this.collectNoiseSample(rms);
    if (rms < this.getAdaptiveMinRms()) {
      // Very quiet - reset state but continue listening
      if (this.isListening()) {
        this.animationId = requestAnimationFrame(() => this.detectPitch());
      }
      return;
    }

    const autoResult = this.autoCorrelate(this.audioBuffer, this.audioContext.sampleRate);
    const preferAuto = !!autoResult && autoResult.frequency < this.LOW_STRING_FREQUENCY;

    if (preferAuto && autoResult) {
      const autoMinClarity = this.getAdaptiveClarity(autoResult.frequency);
      if (autoResult.clarity >= autoMinClarity * 0.7) {
        // FIX: Apply octave correction in detection pipeline
        const correctedFrequency = this.correctOctaveError(autoResult.frequency, autoResult.clarity);
        this.updateTunerState(correctedFrequency, autoResult.clarity);
        
        // FIX: Only schedule next frame if still listening
        if (this.isListening()) {
          this.animationId = requestAnimationFrame(() => this.detectPitch());
        }
        return;
      }
    }

    // Autocorrelation result
    if (autoResult && autoResult.frequency >= 30 && autoResult.frequency <= 4000) {
      const autoMinClarity = this.getAdaptiveClarity(autoResult.frequency);
      if (autoResult.clarity >= autoMinClarity * 0.7) {
        // FIX: Apply octave correction in detection pipeline
        const correctedFrequency = this.correctOctaveError(autoResult.frequency, autoResult.clarity);
        this.updateTunerState(correctedFrequency, autoResult.clarity);
      }
    }

    // FIX: Only schedule next frame if still listening
    if (this.isListening()) {
      this.animationId = requestAnimationFrame(() => this.detectPitch());
    }
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
      if (this.DEBUG_MODE) {
        console.log(`Octave correction: ${frequency.toFixed(1)}Hz -> ${halfFreq.toFixed(1)}Hz (detected harmonic)`);
      }
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
    const stableNote = this.applyNoteStabilization(noteInfo);
    if (!stableNote) {
      this.tunerState.update(state => ({
        ...state,
        currentFrequency: stableFrequency,
        clarity
      }));
      return;
    }
    const stableCents = this.applyCentsStabilization(noteInfo.cents);

    // Update tuning history for trend analysis
    this.tuningHistory.push(stableCents);
    if (this.tuningHistory.length > this.TUNING_HISTORY_SIZE) {
      this.tuningHistory.shift();
    }

    this.tunerState.update(state => ({
      ...state,
      currentFrequency: stableFrequency,
      detectedNote: stableNote.note,
      detectedOctave: stableNote.octave,
      cents: stableCents,
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

  // FIX: Adaptive smoothing based on rate of change
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

    // FIX: Adaptive smoothing - use higher factor for rapid changes
    const smoothingFactor = Math.abs(delta) > 20 
      ? this.ADAPTIVE_SMOOTHING_FACTOR 
      : this.SMOOTHING_FACTOR;

    this.smoothedFrequency =
      (this.smoothedFrequency * (1 - smoothingFactor)) +
      (limited * smoothingFactor);

    return this.smoothedFrequency;
  }

  private applyCentsStabilization(cents: number): number {
    if (this.smoothedCents === 0) {
      this.smoothedCents = cents;
    } else {
      this.smoothedCents =
        (this.smoothedCents * (1 - this.CENTS_SMOOTHING_FACTOR)) +
        (cents * this.CENTS_SMOOTHING_FACTOR);
    }

    const rounded = Math.round(this.smoothedCents);
    if (Math.abs(rounded) <= this.CENTS_DEAD_ZONE) {
      return 0;
    }
    return rounded;
  }

  private applyNoteStabilization(noteInfo: NoteInfo): NoteInfo | null {
    const now = performance.now();
    const noteKey = `${noteInfo.note}${noteInfo.octave}`;
    if (!noteKey) return null;

    if (noteKey === this.candidateNoteKey) {
      this.candidateNoteFrames += 1;
    } else {
      this.candidateNoteKey = noteKey;
      this.candidateNoteFrames = 1;
    }

    const inStartup = now - this.sessionStartTime < this.STARTUP_STABILIZATION_MS;
    const requiredFrames = inStartup ? this.NOTE_LOCK_FRAMES_STARTUP : this.NOTE_LOCK_FRAMES_STEADY;

    if (!this.acceptedNoteKey) {
      if (this.candidateNoteFrames < requiredFrames) return null;
      this.acceptedNoteKey = noteKey;
      return noteInfo;
    }

    if (noteKey === this.acceptedNoteKey) {
      return noteInfo;
    }

    if (this.candidateNoteFrames < requiredFrames) {
      return null;
    }

    this.acceptedNoteKey = noteKey;
    return noteInfo;
  }

  private collectNoiseSample(rms: number): void {
    const elapsed = performance.now() - this.sessionStartTime;
    if (elapsed > this.STARTUP_STABILIZATION_MS * 2) return;

    this.rmsNoiseSamples.push(rms);
    if (this.rmsNoiseSamples.length > this.NOISE_SAMPLE_WINDOW) {
      this.rmsNoiseSamples.shift();
    }
  }

  private getAdaptiveMinRms(): number {
    if (this.rmsNoiseSamples.length < 8) {
      return this.VERY_LOW_RMS;
    }

    const sorted = [...this.rmsNoiseSamples].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const adaptive = median * 2.2;
    return Math.max(this.VERY_LOW_RMS, Math.min(this.MIN_RMS, adaptive));
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
   * FIX: Corrected note index calculation for negative values and proper octave handling
   */
  private frequencyToNote(frequency: number): NoteInfo {
    const A4 = this.customA4Frequency(); // Use configurable A4 frequency
    
    // Calculate note number relative to A4 (A4 = note 0)
    const noteNum = 12 * (Math.log2(frequency / A4));
    const roundedNote = Math.round(noteNum);

    // Calculate cents (deviation from nearest note)
    const cents = Math.round((noteNum - roundedNote) * 100);

    // FIX: Proper note index calculation with correct negative modulo handling
    let noteIndex: number;
    if (NOTE_NAMES[0] === 'A') {
      // Array starts with A, so A4 is at index 0
      noteIndex = ((roundedNote % 12) + 12) % 12;
    } else {
      // Array starts with C, so A4 is 9 semitones above C4
      // For C-based array: C=0, C#=1, ..., A=9, A#=10, B=11
      noteIndex = ((roundedNote + 9) % 12 + 12) % 12;
    }

    // Validate note index
    if (noteIndex < 0 || noteIndex >= NOTE_NAMES.length) {
      console.error('Invalid note index:', noteIndex, 'NOTE_NAMES length:', NOTE_NAMES.length);
      console.error('NOTE_NAMES:', NOTE_NAMES);
      return { note: 'Unknown', octave: 0, frequency, cents: 0 };
    }

    const note = NOTE_NAMES[noteIndex];
    
    // FIX: Robust octave calculation
    // Calculate how many octaves away from A4 we are
    // Add 120 to handle negative numbers correctly, then subtract offset
    const octave = Math.floor((roundedNote + 9 + 120) / 12) + 4 - 10;

    // FIX: Debug logging only when DEBUG_MODE is true
    if (this.DEBUG_MODE) {
      if (frequency > 300 && frequency < 350) { // High E range
        console.log(`High E debug: freq=${frequency.toFixed(1)}Hz, semitones=${roundedNote}, noteIndex=${noteIndex}, note=${note}${octave}, NOTE_NAMES[0]=${NOTE_NAMES[0]}`);
      }
      if (frequency > 190 && frequency < 205) { // G string range
        console.log(`G string debug: freq=${frequency.toFixed(1)}Hz, semitones=${roundedNote}, noteIndex=${noteIndex}, note=${note}${octave}, NOTE_NAMES[0]=${NOTE_NAMES[0]}`);
      }
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
   * FIX: Added error logging for missing tuning
   */
  setTuning(tuningId: string): void {
    const tuning = TUNING_PRESETS.find(t => t.id === tuningId);
    if (tuning) {
      this.selectedTuning.set(tuning);
    } else {
      console.warn(`Tuning preset not found: ${tuningId}`);
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
    const a4Index = NOTE_NAMES[0] === 'A' ? 0 : 9; // A is at index 0 or 9
    const semitoneOffset = (octave - 4) * 12 + (noteIndex - a4Index);

    return A4 * Math.pow(2, semitoneOffset / 12);
  }

  /**
   * Stop all active oscillators
   * FIX: New method to clean up oscillators
   */
  private stopAllOscillators(): void {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    this.activeOscillators.clear();
  }

  /**
   * Play reference tone with harmonics for realistic instrument sound
   * FIX: Separate playback context, track oscillators for cleanup
   */
  playReferenceTone(stringInfo: StringInfo, duration: number = 1000): void {
    try {
      // FIX: Use separate playback context
      if (!this.playbackContext || this.playbackContext.state === 'closed') {
        this.playbackContext = new AudioContext();
      }

      const currentTime = this.playbackContext.currentTime;
      const endTime = currentTime + duration / 1000;

      // Master gain node
      const masterGain = this.playbackContext.createGain();
      masterGain.gain.value = 0.3;

      const instrument = this.instrumentService.currentInstrument();

      // Create fundamental frequency
      const fundamental = this.playbackContext.createOscillator();
      const fundamentalGain = this.playbackContext.createGain();

      // FIX: Track oscillator for cleanup
      this.activeOscillators.add(fundamental);

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
          const detune = this.playbackContext.createOscillator();
          const detuneGain = this.playbackContext.createGain();
          this.activeOscillators.add(detune);
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
      masterGain.connect(this.playbackContext.destination);

      // Start fundamental
      fundamental.start(currentTime);
      fundamental.stop(endTime);

      // FIX: Remove from active set when stopped
      fundamental.onended = () => {
        this.activeOscillators.delete(fundamental);
      };

    } catch (error) {
      console.error('Failed to play reference tone:', error);
      throw new Error('Audio playback unavailable');
    }
  }

  /**
   * Helper method to add harmonic overtones
   * FIX: Track oscillators for cleanup
   */
  private addHarmonic(
    frequency: number,
    gainValue: number,
    type: OscillatorType,
    destination: GainNode,
    endTime: number
  ): void {
    if (!this.playbackContext) return;

    const currentTime = this.playbackContext.currentTime;
    const oscillator = this.playbackContext.createOscillator();
    const gain = this.playbackContext.createGain();

    // FIX: Track oscillator for cleanup
    this.activeOscillators.add(oscillator);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;

    oscillator.connect(gain);
    gain.connect(destination);

    oscillator.start(currentTime);
    oscillator.stop(endTime);

    // FIX: Remove from active set when stopped
    oscillator.onended = () => {
      this.activeOscillators.delete(oscillator);
    };
  }

  /**
   * Format cents display
   */
  formatCents(cents: number): string {
    const sign = cents >= 0 ? '+' : '';
    return `${sign}${cents}`;
  }
}
