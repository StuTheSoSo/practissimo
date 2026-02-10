// src/app/core/services/metronome.service.ts
import { Injectable, signal, computed } from '@angular/core';

/**
 * MetronomeService - Audio metronome with adjustable BPM and time signatures
 * Uses Web Audio API for precise timing
 */
@Injectable({
  providedIn: 'root'
})
export class MetronomeService {
  private audioContext: AudioContext | null = null;
  private nextNoteTime = 0;
  private scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  private lookahead = 25; // How frequently to call scheduling function (ms)
  private timerID: any = null;
  private currentBeatInBar = 0;
  private readonly visibilityHandler = () => this.handleVisibilityChange();

  // State signals
  private isPlayingSignal = signal<boolean>(false);
  private bpmSignal = signal<number>(120);
  private beatsPerBarSignal = signal<number>(4);
  private volumeSignal = signal<number>(1.0);
  private readonly maxVolume = 2.0;

  // Public readonly signals
  readonly isPlaying = this.isPlayingSignal.asReadonly();
  readonly bpm = this.bpmSignal.asReadonly();
  readonly beatsPerBar = this.beatsPerBarSignal.asReadonly();
  readonly volume = this.volumeSignal.asReadonly();

  // Computed
  readonly secondsPerBeat = computed(() => 60.0 / this.bpm());

  // Common time signatures
  readonly timeSignatures = [
    { label: '2/4', beats: 2 },
    { label: '3/4', beats: 3 },
    { label: '4/4', beats: 4 },
    { label: '5/4', beats: 5 },
    { label: '6/8', beats: 6 },
    { label: '7/8', beats: 7 },
  ];

  constructor() {
    // Initialize AudioContext on user interaction (browsers require this)
    this.initAudioContext();
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  /**
   * Initialize Web Audio API context
   */
  private initAudioContext(): void {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.onAppResume();
    }
  }

  private async onAppResume(): Promise<void> {
    this.initAudioContext();

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch {
        // Some platforms require a user gesture; ignore and wait for next toggle.
      }
    }

    if (this.isPlaying()) {
      this.restartScheduler();
    }
  }

  private restartScheduler(): void {
    if (!this.audioContext) return;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.nextNoteTime = this.audioContext.currentTime;
    this.scheduler();
  }

  /**
   * Start the metronome
   */
  start(): void {
    if (this.isPlaying()) return;

    this.initAudioContext();

    if (this.audioContext!.state === 'suspended') {
      this.audioContext!.resume();
    }

    this.currentBeatInBar = 0;
    this.nextNoteTime = this.audioContext!.currentTime;
    this.isPlayingSignal.set(true);
    this.scheduler();
  }

  /**
   * Stop the metronome
   */
  stop(): void {
    this.isPlayingSignal.set(false);
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.currentBeatInBar = 0;
  }

  /**
   * Toggle metronome on/off
   */
  toggle(): void {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Set BPM (30-300)
   */
  setBpm(bpm: number): void {
    this.bpmSignal.set(Math.max(30, Math.min(300, bpm)));
  }

  /**
   * Increase BPM by amount
   */
  increaseBpm(amount: number = 5): void {
    this.setBpm(this.bpm() + amount);
  }

  /**
   * Decrease BPM by amount
   */
  decreaseBpm(amount: number = 5): void {
    this.setBpm(this.bpm() - amount);
  }

  /**
   * Set time signature (beats per bar)
   */
  setBeatsPerBar(beats: number): void {
    this.beatsPerBarSignal.set(beats);
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.volumeSignal.set(Math.max(0, Math.min(this.maxVolume, volume)));
  }

  /**
   * Schedule metronome beats
   */
  private scheduler(): void {
    // Schedule beats that are due to play before the next interval
    while (this.nextNoteTime < this.audioContext!.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.nextNoteTime);
      this.nextNote();
    }

    if (this.isPlaying()) {
      this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  /**
   * Calculate timing for next note
   */
  private nextNote(): void {
    const secondsPerBeat = this.secondsPerBeat();
    this.nextNoteTime += secondsPerBeat;

    this.currentBeatInBar++;
    if (this.currentBeatInBar >= this.beatsPerBar()) {
      this.currentBeatInBar = 0;
    }
  }

  /**
   * Schedule a single metronome beat
   */
  private scheduleNote(time: number): void {
    const isAccent = this.currentBeatInBar === 0;

    // Create oscillator for the click sound
    const osc = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();

    // Accent beat (first beat of bar) is higher pitched and louder
    osc.frequency.value = isAccent ? 1000 : 800;

    // Volume envelope
    const volume = this.volume();
    const boosted = isAccent ? volume * 2.0 : volume * 1.6;
    const targetGain = Math.min(this.maxVolume, boosted);
    gainNode.gain.setValueAtTime(targetGain, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  /**
   * Tap tempo - call this multiple times to set BPM
   */
  private lastTapTime: number | null = null;
  private tapTimes: number[] = [];

  tapTempo(): void {
    const now = Date.now();

    if (this.lastTapTime && (now - this.lastTapTime) < 2000) {
      // Within 2 seconds of last tap
      this.tapTimes.push(now - this.lastTapTime);

      // Keep only last 4 taps
      if (this.tapTimes.length > 4) {
        this.tapTimes.shift();
      }

      // Calculate average interval
      const avgInterval = this.tapTimes.reduce((a, b) => a + b, 0) / this.tapTimes.length;
      const calculatedBpm = Math.round(60000 / avgInterval);

      this.setBpm(calculatedBpm);
    } else {
      // Reset if too much time has passed
      this.tapTimes = [];
    }

    this.lastTapTime = now;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
