// src/app/core/services/practice.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { PracticeSession } from '../models/practice-session.model';
import { TimerState } from '../models/timer-state.model';
import { StorageService } from './storage.service';
import { InstrumentService } from './instrument.service';
import { XpService } from './xp.service';
import { GamificationService } from './gamification.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';

/**
 * PracticeService - Manages practice sessions and timer
 */
@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  private storage = inject(StorageService);
  private instrumentService = inject(InstrumentService);
  private xpService = inject(XpService);
  private gamificationService = inject(GamificationService);

  // Timer state
  private timerState = signal<TimerState>({
    isRunning: false,
    isPaused: false,
    elapsedSeconds: 0,
    startTime: null,
    pausedTime: null
  });

  // Session state
  private currentCategory = signal<string | null>(null);
  private currentNotes = signal<string>('');

  // Sessions cache
  private sessions = signal<PracticeSession[]>([]);

  // Public readonly signals
  readonly timer = this.timerState.asReadonly();
  readonly category = this.currentCategory.asReadonly();
  readonly notes = this.currentNotes.asReadonly();
  readonly allSessions = this.sessions.asReadonly();

  // Computed signals
  readonly elapsedMinutes = computed(() =>
    Math.floor(this.timer().elapsedSeconds / 60)
  );

  readonly elapsedSeconds = computed(() =>
    this.timer().elapsedSeconds % 60
  );

  readonly formattedTime = computed(() => {
    const minutes = this.elapsedMinutes();
    const seconds = this.elapsedSeconds();
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  readonly canStart = computed(() =>
    !this.timer().isRunning && this.currentCategory() !== null
  );

  readonly canPause = computed(() =>
    this.timer().isRunning && !this.timer().isPaused
  );

  readonly canResume = computed(() =>
    this.timer().isRunning && this.timer().isPaused
  );

  readonly canStop = computed(() =>
    this.timer().isRunning
  );

  // Filter sessions by instrument
  readonly currentInstrumentSessions = computed(() => {
    const currentInstrument = this.instrumentService.currentInstrument();
    return this.sessions().filter(s => s.instrument === currentInstrument);
  });

  // Timer observable
  private timer$?: Observable<number>;

  constructor() {
    // Effect to persist sessions when they change
    effect(() => {
      const sessionsData = this.sessions();
      if (sessionsData.length > 0) {
        this.storage.set(STORAGE_KEYS.PRACTICE_SESSIONS, sessionsData);
      }
    });
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    const savedSessions = await this.storage.get<PracticeSession[]>(
      STORAGE_KEYS.PRACTICE_SESSIONS
    );

    if (savedSessions) {
      this.sessions.set(savedSessions);
    }
  }

  /**
   * Set practice category
   */
  setCategory(category: string): void {
    this.currentCategory.set(category);
  }

  /**
   * Set practice notes
   */
  setNotes(notes: string): void {
    this.currentNotes.set(notes);
  }

  /**
   * Start practice timer
   */
  startTimer(): void {
    if (!this.canStart()) return;

    const now = Date.now();
    this.timerState.update(state => ({
      ...state,
      isRunning: true,
      isPaused: false,
      startTime: now,
      elapsedSeconds: 0
    }));

    this.startTimerTick();
  }

  /**
   * Pause timer
   */
  pauseTimer(): void {
    if (!this.canPause()) return;

    this.timerState.update(state => ({
      ...state,
      isPaused: true,
      pausedTime: Date.now()
    }));
  }

  /**
   * Resume timer
   */
  resumeTimer(): void {
    if (!this.canResume()) return;

    const pausedDuration = Date.now() - (this.timerState().pausedTime || 0);

    this.timerState.update(state => ({
      ...state,
      isPaused: false,
      startTime: (state.startTime || 0) + pausedDuration,
      pausedTime: null
    }));
  }

  /**
   * Stop timer and save session
   */
  async stopTimer(): Promise<PracticeSession> {
    if (!this.canStop()) return Promise.reject('Cannot stop timer');

    const duration = this.elapsedMinutes();
    const category = this.currentCategory();
    const notes = this.currentNotes();
    const instrument = this.instrumentService.currentInstrument();

    // Get current streak for XP calculation
    const currentStreak = this.gamificationService.currentStreak();
    const xpEarned = this.xpService.calculateXpForSession(duration, currentStreak);

    // Create session
    const session: PracticeSession = {
      id: this.generateSessionId(),
      instrument,
      date: new Date().toISOString(),
      duration,
      category: category || 'General',
      notes: notes || undefined,
      xpEarned
    };

    // Save session
    this.sessions.update(sessions => [...sessions, session]);

    // Update gamification
    await this.gamificationService.onPracticeCompleted(session);

    // Reset timer
    this.resetTimer();

    return session;
  }

  /**
   * Reset timer state
   */
  private resetTimer(): void {
    this.timerState.set({
      isRunning: false,
      isPaused: false,
      elapsedSeconds: 0,
      startTime: null,
      pausedTime: null
    });
    this.currentCategory.set(null);
    this.currentNotes.set('');
  }

  /**
   * Start timer tick (RxJS interval)
   */
  private startTimerTick(): void {
    this.timer$ = interval(1000).pipe(
      map(() => {
        const state = this.timerState();
        if (!state.isRunning || state.isPaused) return state.elapsedSeconds;

        const elapsed = Math.floor((Date.now() - (state.startTime || 0)) / 1000);
        this.timerState.update(s => ({ ...s, elapsedSeconds: elapsed }));
        return elapsed;
      })
    );

    this.timer$.subscribe();
  }

  /**
   * Get sessions for a specific instrument
   */
  getSessionsByInstrument(instrument: string): PracticeSession[] {
    return this.sessions().filter(s => s.instrument === instrument);
  }

  /**
   * Get total practice time for an instrument (in minutes)
   */
  getTotalPracticeTime(instrument?: string): number {
    const filteredSessions = instrument
      ? this.sessions().filter(s => s.instrument === instrument)
      : this.sessions();

    return filteredSessions.reduce((total, session) => total + session.duration, 0);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
