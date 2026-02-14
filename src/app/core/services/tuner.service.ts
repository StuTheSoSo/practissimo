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
  private playbackContext?: AudioContext;
  private nativeStream?: MediaStream;
  private nativeSource?: MediaStreamAudioSourceNode;
  private nativeAnalyser?: AnalyserNode;
  private highpassFilter?: BiquadFilterNode;
  private animationId?: number;
  private audioBuffer?: Float32Array<ArrayBuffer>;
  private activeOscillators: Set<OscillatorNode> = new Set();

  // Configuration
  private customA4Frequency = signal<number>(440);
  private readonly MIN_CLARITY = 0.9;
  private readonly BUFFER_SIZE = 8192;
  private readonly SMOOTHING_FACTOR = 0.12;
  private readonly ADAPTIVE_SMOOTHING_FACTOR = 0.25;
  private readonly MIN_RMS = 0.0012;
  private readonly VERY_LOW_RMS = 0.00018;
  private readonly LOW_STRING_FREQUENCY = 180;
  private readonly IN_TUNE_TOLERANCE_CENTS = 15;
  private readonly CENTS_DEAD_ZONE = 3;
  private readonly CENTS_SMOOTHING_FACTOR = 0.22;
  private readonly STARTUP_STABILIZATION_MS = 1200;
  private readonly NOTE_LOCK_FRAMES_STARTUP = 5;
  private readonly NOTE_LOCK_FRAMES_STEADY = 2;
  private readonly NOISE_SAMPLE_WINDOW = 40;
  private readonly STRING_SWITCH_HZ_MARGIN = 12;
  private readonly STRING_SWITCH_FRAMES = 3;
  private readonly UI_UPDATE_INTERVAL_MS = 40;
  private readonly HISTORY_SIZE = 7;
  private readonly TUNING_HISTORY_SIZE = 30;
  private readonly DEBUG_MODE = true; // ← Set to true during testing high strings

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
  private tuningHistory: number[] = [];
  private sessionStartTime = 0;
  private rmsNoiseSamples: number[] = [];
  private candidateNoteKey = '';
  private candidateNoteFrames = 0;
  private acceptedNoteKey = '';
  private lockedString: StringInfo | null = null;
  private switchCandidateString: StringInfo | null = null;
  private switchCandidateFrames = 0;
  private lastUiUpdateAt = 0;
  private readonly visibilityHandler = () => this.handleVisibilityChange();

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

  readonly closestString = computed<StringInfo | undefined>(() => {
    const freq = this.state().currentFrequency;
    if (freq <= 30) return undefined;

    const tuning = this.currentTuning();
    if (!tuning?.strings.length) return undefined;

    if (this.lockedString) {
      const diff = Math.abs(freq - this.lockedString.frequency);
      if (diff < 35) return this.lockedString;
    }

    return tuning.strings.reduce((best, str) => {
      return Math.abs(freq - str.frequency) < Math.abs(freq - best.frequency) ? str : best;
    }, tuning.strings[0]);
  });

  readonly tuningTrend = computed<'improving' | 'stable' | 'worsening' | 'unknown'>(() => {
    if (this.tuningHistory.length < 10) return 'unknown';
    const recent = this.tuningHistory.slice(-10);
    const older = this.tuningHistory.slice(-20, -10);
    if (older.length === 0) return 'unknown';
    const recentAvg = recent.reduce((sum, val) => sum + Math.abs(val), 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + Math.abs(val), 0) / older.length;
    const threshold = 2;
    if (recentAvg < olderAvg - threshold) return 'improving';
    if (recentAvg > olderAvg + threshold) return 'worsening';
    return 'stable';
  });

  readonly tuningSuggestion = computed<'tighten' | 'loosen' | 'good' | null>(() => {
    if (!this.isListening() || this.tuningHistory.length < 15) return null;
    const recent = this.tuningHistory.slice(-15);
    const avgCents = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const consistency = recent.filter(val => Math.sign(val) === Math.sign(avgCents)).length / recent.length;
    if (consistency < 0.8 || Math.abs(avgCents) < 8) return null;
    if (Math.abs(avgCents) <= 5) return 'good';
    return avgCents > 0 ? 'loosen' : 'tighten';
  });

  constructor() {
    document.addEventListener('visibilitychange', this.visibilityHandler);
    effect(() => {
      const instrument = this.instrumentService.currentInstrument();
      const tunings = getTuningsForInstrument(instrument);
      const current = this.selectedTuning();

      if (tunings.length === 0) {
        if (this.isListening()) this.stop();
        this.selectedTuning.set(null);
        return;
      }

      if (!current || current.instrument !== instrument) {
        this.selectedTuning.set(tunings[0]);
      }
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.stop();
    this.stopAllOscillators();
    if (this.playbackContext) {
      this.playbackContext.close();
      this.playbackContext = undefined;
    }
  }

  setA4Frequency(frequency: number): void {
    if (frequency < 400 || frequency > 480) {
      throw new Error('A4 frequency must be between 400 and 480 Hz');
    }
    this.customA4Frequency.set(frequency);

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

  getTuningHistory(): ReadonlyArray<number> {
    return [...this.tuningHistory];
  }

  clearTuningHistory(): void {
    this.tuningHistory = [];
  }

  async start(): Promise<void> {
    if (this.isListening()) return;
    if (this.availableTunings().length === 0) {
      throw new Error('Tuner is not available for this instrument');
    }

    try {
      await this.ensureMicrophonePermission();
      this.audioContext = new AudioContext();
      await this.setupNativeInput();

      this.audioBuffer = new Float32Array(new ArrayBuffer(this.BUFFER_SIZE * 4));
      this.normalizedBuffer = new Float32Array(this.BUFFER_SIZE);
      this.sessionStartTime = performance.now();
      this.rmsNoiseSamples = [];
      this.candidateNoteKey = '';
      this.candidateNoteFrames = 0;
      this.acceptedNoteKey = '';
      this.lockedString = null;
      this.switchCandidateString = null;
      this.switchCandidateFrames = 0;
      this.lastUiUpdateAt = 0;

      this.tunerState.update(state => ({ ...state, isListening: true }));
      this.detectPitch();
    } catch (error) {
      const normalized = this.normalizeError(error, 'Microphone access denied or unavailable');
      console.error('Failed to start tuner:', normalized.message, error);
      throw normalized;
    }
  }

  stop(): void {
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

    if (this.highpassFilter) {
      this.highpassFilter.disconnect();
      this.highpassFilter = undefined;
    }

    if (this.nativeAnalyser) {
      this.nativeAnalyser.disconnect();
      this.nativeAnalyser = undefined;
    }

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
    this.lockedString = null;
    this.switchCandidateString = null;
    this.switchCandidateFrames = 0;
    this.lastUiUpdateAt = 0;

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
      const normalized = this.normalizeError(error, 'Microphone access failed: UnknownError');
      throw new Error(normalized.message);
    }
  }

  private async setupNativeInput(): Promise<void> {
    if (!this.audioContext) throw new Error('Native input failed: missing audio context');
    try {
      this.nativeStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.nativeSource = this.audioContext.createMediaStreamSource(this.nativeStream);
      this.nativeAnalyser = this.audioContext.createAnalyser();
      this.nativeAnalyser.fftSize = this.BUFFER_SIZE;
      this.nativeAnalyser.smoothingTimeConstant = 0.9;

      this.highpassFilter = this.audioContext.createBiquadFilter();
      this.highpassFilter.type = 'highpass';
      this.highpassFilter.frequency.value = 85;
      this.highpassFilter.Q.value = 0.8;

      this.nativeSource.connect(this.highpassFilter);
      this.highpassFilter.connect(this.nativeAnalyser);
    } catch (error) {
      const normalized = this.normalizeError(error, 'Native input failed');
      throw new Error(`Native input failed: ${normalized.message}`);
    }
  }

  private normalizeError(error: unknown, fallbackMessage: string): Error {
    if (error instanceof Error) return error;
    if (typeof error === 'string') return new Error(error);
    if (error && typeof error === 'object') {
      const msg = (error as any).message;
      const name = (error as any).name;
      if (msg) return new Error(msg);
      if (name) return new Error(`Microphone access failed: ${name}`);
      try { return new Error(JSON.stringify(error)); } catch { return new Error(fallbackMessage); }
    }
    return new Error(fallbackMessage);
  }

  private async handleVisibilityChange(): Promise<void> {
    if (!this.isListening() || !this.audioContext) return;
    if (document.visibilityState !== 'visible') return;
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        this.stop();
      }
    }
  }

  private detectPitch(): void {
    if (!this.isListening() || !this.audioContext || !this.audioBuffer || !this.nativeAnalyser) return;

    this.nativeAnalyser.getFloatTimeDomainData(this.audioBuffer);
    const rms = this.calculateRMS(this.audioBuffer);
    this.collectNoiseSample(rms);
    if (rms < this.getAdaptiveMinRms()) {
      if (this.isListening()) this.animationId = requestAnimationFrame(() => this.detectPitch());
      return;
    }

    const autoResult = this.autoCorrelate(this.audioBuffer, this.audioContext.sampleRate);
    const preferAuto = !!autoResult && autoResult.frequency < this.LOW_STRING_FREQUENCY;

    if (preferAuto && autoResult) {
      const autoMinClarity = this.getAdaptiveClarity(autoResult.frequency);
      if (autoResult.clarity >= autoMinClarity) {
        const correctedFrequency = this.correctOctaveError(autoResult.frequency, autoResult.clarity);
        this.updateTunerState(correctedFrequency, autoResult.clarity);
        if (this.isListening()) this.animationId = requestAnimationFrame(() => this.detectPitch());
        return;
      }
    }

    if (autoResult && autoResult.frequency >= 30 && autoResult.frequency <= 4000) {
      const autoMinClarity = this.getAdaptiveClarity(autoResult.frequency);
      if (autoResult.clarity >= autoMinClarity) {
        const correctedFrequency = this.correctOctaveError(autoResult.frequency, autoResult.clarity);
        this.updateTunerState(correctedFrequency, autoResult.clarity);
      }
    }

    if (this.isListening()) this.animationId = requestAnimationFrame(() => this.detectPitch());
  }

  /**
   * IMPROVED: More aggressive octave correction favoring lower octaves for high strings
   */
  private correctOctaveError(frequency: number, clarity: number): number {
    if (frequency < 120) return frequency;

    const tuning = this.selectedTuning();
    if (!tuning || !tuning.strings.length) return frequency;

    const candidates = [
      { freq: frequency,     ratio: 1.0,  score: 0 },
      { freq: frequency / 2, ratio: 0.5,  score: 0 },
      { freq: frequency / 4, ratio: 0.25, score: 0 }, // Rare but helps very bright highs
      { freq: frequency * 2, ratio: 2.0,  score: 0 }
    ];

    let best = candidates[0];

    for (const cand of candidates) {
      let minDiff = Infinity;
      for (const str of tuning.strings) {
        const diff = Math.abs(cand.freq - str.frequency);
        if (diff < minDiff) minDiff = diff;
      }
      cand.score = 1 / (minDiff + 1);
      if (cand.ratio < 1) cand.score *= 1.4;     // Reward going down (common on high strings)
      if (cand.ratio > 1) cand.score *= 0.5;     // Punish going up more strongly
      if (minDiff < 8) cand.score *= 1.8;        // Extra boost if very close to a string

      if (cand.score > best.score) best = cand;
    }

    const corrected = frequency * best.ratio;

    if (best.ratio !== 1 && this.DEBUG_MODE) {
      console.log(`Octave corrected: ${frequency.toFixed(1)} Hz → ${corrected.toFixed(1)} Hz (ratio ${best.ratio})`);
    }

    return corrected;
  }

  private calculateRMS(buffer: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
    return Math.sqrt(sum / buffer.length);
  }

  private updateTunerState(frequency: number, clarity: number): void {
    const stableFrequency = this.applyFrequencySmoothing(frequency);
    const targetNote = this.getStableTargetString(stableFrequency);
    const noteInfo = this.frequencyToNote(stableFrequency);
    const stableNote = this.applyNoteStabilization(noteInfo);
    const now = performance.now();
    if (this.lastUiUpdateAt !== 0 && now - this.lastUiUpdateAt < this.UI_UPDATE_INTERVAL_MS) return;
    this.lastUiUpdateAt = now;

    if (!stableNote) {
      this.tunerState.update(state => ({ ...state, currentFrequency: stableFrequency, targetNote, clarity }));
      return;
    }

    const stableCents = this.applyCentsStabilization(noteInfo.cents);
    this.tuningHistory.push(stableCents);
    if (this.tuningHistory.length > this.TUNING_HISTORY_SIZE) this.tuningHistory.shift();

    this.tunerState.update(state => ({
      ...state,
      currentFrequency: stableFrequency,
      detectedNote: stableNote.note,
      detectedOctave: stableNote.octave,
      cents: stableCents,
      targetNote,
      clarity
    }));
  }

  private getStableTargetString(frequency: number): StringInfo | undefined {
    const tuning = this.selectedTuning();
    if (!tuning || tuning.strings.length === 0 || frequency <= 0) {
      this.lockedString = null;
      return undefined;
    }

    const nearest = tuning.strings.reduce((closest, string) => {
      const currentDiff = Math.abs(frequency - closest.frequency);
      const newDiff = Math.abs(frequency - string.frequency);
      return newDiff < currentDiff ? string : closest;
    }, tuning.strings[0]);

    if (!this.lockedString) {
      this.lockedString = nearest;
      this.switchCandidateString = null;
      this.switchCandidateFrames = 0;
      return this.lockedString;
    }

    if (nearest.stringNumber === this.lockedString.stringNumber) {
      this.switchCandidateString = null;
      this.switchCandidateFrames = 0;
      return this.lockedString;
    }

    const lockedDiff = Math.abs(frequency - this.lockedString.frequency);
    const nearestDiff = Math.abs(frequency - nearest.frequency);
    const shouldSwitch = nearestDiff + this.STRING_SWITCH_HZ_MARGIN < lockedDiff;

    if (!shouldSwitch) {
      this.switchCandidateString = null;
      this.switchCandidateFrames = 0;
      return this.lockedString;
    }

    if (this.switchCandidateString && this.switchCandidateString.stringNumber === nearest.stringNumber) {
      this.switchCandidateFrames += 1;
    } else {
      this.switchCandidateString = nearest;
      this.switchCandidateFrames = 1;
    }

    if (this.switchCandidateFrames >= this.STRING_SWITCH_FRAMES) {
      this.lockedString = nearest;
      this.switchCandidateString = null;
      this.switchCandidateFrames = 0;
    }

    return this.lockedString;
  }

  /**
   * IMPROVED: Lower clarity thresholds for high frequencies (treble strings have more harmonics)
   */
  private getAdaptiveClarity(frequency: number): number {
    if (frequency <= 0) return this.MIN_CLARITY;

    if (frequency < 90) return 0.75;
    if (frequency < this.LOW_STRING_FREQUENCY) return 0.85;

    // High strings → more lenient clarity requirements
    if (frequency > 400) return 0.82;   // Was 0.93
    if (frequency > 300) return 0.86;   // Was 0.91
    if (frequency > 200) return 0.88;

    return this.MIN_CLARITY;
  }

  private applyFrequencySmoothing(frequency: number): number {
    if (frequency <= 0) return this.smoothedFrequency;

    this.frequencyHistory.push(frequency);
    if (this.frequencyHistory.length > this.HISTORY_SIZE) this.frequencyHistory.shift();

    const sorted = [...this.frequencyHistory].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    if (this.smoothedFrequency === 0) {
      this.smoothedFrequency = median;
      return this.smoothedFrequency;
    }

    const delta = median - this.smoothedFrequency;
    const maxStep = this.smoothedFrequency < this.LOW_STRING_FREQUENCY ? 6 : 12;
    const limited = Math.abs(delta) > maxStep ? this.smoothedFrequency + Math.sign(delta) * maxStep : median;

    const smoothingFactor = Math.abs(delta) > 20 ? this.ADAPTIVE_SMOOTHING_FACTOR : this.SMOOTHING_FACTOR;

    this.smoothedFrequency = (this.smoothedFrequency * (1 - smoothingFactor)) + (limited * smoothingFactor);
    return this.smoothedFrequency;
  }

  private applyCentsStabilization(cents: number): number {
    if (this.smoothedCents === 0) {
      this.smoothedCents = cents;
    } else {
      this.smoothedCents = (this.smoothedCents * (1 - this.CENTS_SMOOTHING_FACTOR)) + (cents * this.CENTS_SMOOTHING_FACTOR);
    }

    const rounded = Math.round(this.smoothedCents);
    return Math.abs(rounded) <= this.CENTS_DEAD_ZONE ? 0 : rounded;
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

    if (noteKey === this.acceptedNoteKey) return noteInfo;
    if (this.candidateNoteFrames < requiredFrames) return null;

    this.acceptedNoteKey = noteKey;
    return noteInfo;
  }

  private collectNoiseSample(rms: number): void {
    const elapsed = performance.now() - this.sessionStartTime;
    if (elapsed > this.STARTUP_STABILIZATION_MS * 2) return;

    this.rmsNoiseSamples.push(rms);
    if (this.rmsNoiseSamples.length > this.NOISE_SAMPLE_WINDOW) this.rmsNoiseSamples.shift();
  }

  private getAdaptiveMinRms(): number {
    if (this.rmsNoiseSamples.length < 8) return this.VERY_LOW_RMS;
    const sorted = [...this.rmsNoiseSamples].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const adaptive = median * 2.2;
    return Math.max(this.VERY_LOW_RMS, Math.min(this.MIN_RMS, adaptive));
  }

  private autoCorrelate(buffer: Float32Array, sampleRate: number): { frequency: number; clarity: number } | null {
    const size = buffer.length;
    const minLag = Math.floor(sampleRate / 4000);
    const maxLag = Math.floor(sampleRate / 30);

    let mean = 0;
    for (let i = 0; i < size; i++) mean += buffer[i];
    mean /= size;

    let rms = 0;
    const normalized = this.normalizedBuffer!;
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
      for (let i = 0; i < size - lag; i++) sum += normalized[i] * normalized[i + lag];
      const correlation = sum / (size - lag);
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestLag = lag;
      }
    }

    if (bestLag === -1) return null;

    const prevLag = Math.max(minLag, bestLag - 1);
    const nextLag = Math.min(maxLag, bestLag + 1);
    const prev = this.autocorrelationAtLag(normalized, prevLag);
    const curr = this.autocorrelationAtLag(normalized, bestLag);
    const next = this.autocorrelationAtLag(normalized, nextLag);

    const denom = (prev - 2 * curr + next);
    const shift = denom !== 0 ? 0.5 * (prev - next) / denom : 0;
    const refinedLag = bestLag + shift;

    const frequency = sampleRate / refinedLag;

    const energyAtZero = this.autocorrelationAtLag(normalized, 0);
    let clarity = 0;
    if (energyAtZero > 1e-10) clarity = bestCorrelation / energyAtZero;
    clarity = Math.max(0, Math.min(1, clarity));
    if (frequency < 60) clarity *= 0.7;

    return { frequency, clarity };
  }

  private autocorrelationAtLag(buffer: Float32Array, lag: number): number {
    let sum = 0;
    for (let i = 0; i < buffer.length - lag; i++) sum += buffer[i] * buffer[i + lag];
    return sum / (buffer.length - lag);
  }

  private frequencyToNote(frequency: number): NoteInfo {
    const A4 = this.customA4Frequency();
    const noteNum = 12 * Math.log2(frequency / A4);
    const roundedNote = Math.round(noteNum);
    const cents = Math.round((noteNum - roundedNote) * 100);

    let noteIndex: number;
    if (NOTE_NAMES[0] === 'A') {
      noteIndex = ((roundedNote % 12) + 12) % 12;
    } else {
      noteIndex = ((roundedNote + 9) % 12 + 12) % 12;
    }

    if (noteIndex < 0 || noteIndex >= NOTE_NAMES.length) {
      console.error('Invalid note index:', noteIndex);
      return { note: 'Unknown', octave: 0, frequency, cents: 0 };
    }

    const note = NOTE_NAMES[noteIndex];
    const octave = Math.floor((roundedNote + 9 + 120) / 12) + 4 - 10;

    if (this.DEBUG_MODE) {
      if (frequency > 300 && frequency < 350) {
        console.log(`High E debug: ${frequency.toFixed(1)}Hz → ${note}${octave} (${cents > 0 ? '+' : ''}${cents}¢)`);
      }
    }

    return { note, octave, frequency, cents };
  }

  setTuning(tuningId: string): void {
    const tuning = TUNING_PRESETS.find(t => t.id === tuningId);
    if (tuning) {
      this.selectedTuning.set(tuning);
      this.lockedString = null;
      this.switchCandidateString = null;
      this.switchCandidateFrames = 0;
    } else {
      console.warn(`Tuning preset not found: ${tuningId}`);
    }
  }

  noteToFrequency(note: string, octave: number): number {
    const A4 = this.customA4Frequency();
    const noteIndex = NOTE_NAMES.indexOf(note);
    if (noteIndex === -1) return 0;

    const a4Index = NOTE_NAMES[0] === 'A' ? 0 : 9;
    const semitoneOffset = (octave - 4) * 12 + (noteIndex - a4Index);
    return A4 * Math.pow(2, semitoneOffset / 12);
  }

  private stopAllOscillators(): void {
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    this.activeOscillators.clear();
  }

  playReferenceTone(stringInfo: StringInfo, duration: number = 1000): void {
    try {
      if (!this.playbackContext || this.playbackContext.state === 'closed') {
        this.playbackContext = new AudioContext();
      }
      const playTone = () => {
        if (!this.playbackContext) return;

        this.stopAllOscillators();

        const currentTime = this.playbackContext.currentTime;
        const attackEnd = currentTime + 0.015;
        const endTime = currentTime + duration / 1000;
        const releaseStart = Math.max(currentTime, endTime - 0.08);
        const instrument = this.instrumentService.currentInstrument();

        const masterGain = this.playbackContext.createGain();
        masterGain.gain.cancelScheduledValues(currentTime);
        masterGain.gain.setValueAtTime(0.0001, currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.25, attackEnd);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, endTime);
        masterGain.connect(this.playbackContext.destination);

        const fundamental = this.playbackContext.createOscillator();
        const fundamentalGain = this.playbackContext.createGain();
        this.activeOscillators.add(fundamental);
        fundamental.type = instrument === 'violin' ? 'sawtooth' : 'triangle';
        fundamental.frequency.setValueAtTime(stringInfo.frequency, currentTime);
        fundamentalGain.gain.setValueAtTime(1, currentTime);
        fundamentalGain.gain.setValueAtTime(1, releaseStart);
        fundamentalGain.gain.linearRampToValueAtTime(0, endTime);
        fundamental.connect(fundamentalGain);
        fundamentalGain.connect(masterGain);
        fundamental.start(currentTime);
        fundamental.stop(endTime);
        fundamental.onended = () => this.activeOscillators.delete(fundamental);

        // Add light harmonics for a clearer, less synthetic pitch cue.
        if (instrument === 'guitar' || instrument === 'bass') {
          this.addHarmonic(stringInfo.frequency * 2, 0.22, 'sine', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 3, 0.1, 'sine', masterGain, endTime);
        } else if (instrument === 'violin') {
          this.addHarmonic(stringInfo.frequency * 2, 0.35, 'triangle', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 3, 0.2, 'triangle', masterGain, endTime);
          this.addHarmonic(stringInfo.frequency * 4, 0.12, 'triangle', masterGain, endTime);
        }
      };

      if (this.playbackContext.state === 'suspended') {
        void this.playbackContext.resume().then(playTone).catch(error => {
          console.error('Failed to resume playback AudioContext:', error);
        });
        return;
      }

      playTone();
    } catch (error) {
      console.error('Failed to play reference tone:', error);
      throw new Error('Audio playback unavailable');
    }
  }

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
    this.activeOscillators.add(oscillator);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(currentTime);
    oscillator.stop(endTime);
    oscillator.onended = () => this.activeOscillators.delete(oscillator);
  }

  formatCents(cents: number): string {
    const sign = cents >= 0 ? '+' : '';
    return `${sign}${cents}`;
  }
}
