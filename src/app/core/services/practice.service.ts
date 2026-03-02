// src/app/core/services/practice.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { PracticeSession } from '../models/practice-session.model';
import { TimerState } from '../models/timer-state.model';
import { StorageService } from './storage.service';
import { InstrumentService } from './instrument.service';
import { XpService } from './xp.service';
import { GamificationService } from './gamification.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';
import { KeepAwakeService } from './keep-awake.service';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  private storage = inject(StorageService);
  private instrumentService = inject(InstrumentService);
  private xpService = inject(XpService);
  private gamificationService = inject(GamificationService);
  private keepAwakeService = inject(KeepAwakeService);

  private timerState = signal<TimerState>({
    isRunning: false,
    isPaused: false,
    elapsedSeconds: 0,
    startTime: null,
    pausedTime: null
  });

  private currentCategory = signal<string | null>(null);
  private currentNotes = signal<string>('');
  private sessions = signal<PracticeSession[]>([]);

  readonly timer = this.timerState.asReadonly();
  readonly category = this.currentCategory.asReadonly();
  readonly notes = this.currentNotes.asReadonly();
  readonly allSessions = this.sessions.asReadonly();

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

  readonly currentInstrumentSessions = computed(() => {
    const currentInstrument = this.instrumentService.currentInstrument();
    return this.sessions().filter(s => s.instrument === currentInstrument);
  });

  private timerSubscription?: Subscription;

  constructor() {
    effect(() => {
      const sessionsData = this.sessions();
      if (sessionsData.length > 0) {
        this.storage.set(STORAGE_KEYS.PRACTICE_SESSIONS, sessionsData);
      }
    });

    effect(() => {
      const isRunning = this.timer().isRunning;
      if (isRunning) {
        void this.keepAwakeService.keepAwake();
      } else {
        void this.keepAwakeService.allowSleep();
      }
    });
  }

  async initialize(): Promise<void> {
    const savedSessions = await this.storage.get<PracticeSession[]>(
      STORAGE_KEYS.PRACTICE_SESSIONS
    );

    if (savedSessions) {
      this.sessions.set(savedSessions);
    }
  }

  setCategory(category: string): void {
    this.currentCategory.set(category);
  }

  setNotes(notes: string): void {
    this.currentNotes.set(notes);
  }

  startTimer(): void {
    if (!this.canStart()) {
      return;
    }

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

  pauseTimer(): void {
    if (!this.canPause()) return;

    this.timerState.update(state => ({
      ...state,
      isPaused: true,
      pausedTime: Date.now()
    }));
  }

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

  async stopTimer(qualityRating?: number): Promise<PracticeSession> {
    if (!this.canStop()) {
      return Promise.reject('Cannot stop timer');
    }

    const duration = this.elapsedMinutes();
    const category = this.currentCategory();
    const notes = this.currentNotes();
    const instrument = this.instrumentService.currentInstrument();

    const currentStreak = this.gamificationService.currentStreak();
    const xpEarned = this.xpService.calculateXpForSession(duration, currentStreak);

    const session: PracticeSession = {
      id: this.generateSessionId(),
      instrument,
      date: new Date().toISOString(),
      duration,
      category: category || 'General',
      notes: notes || undefined,
      xpEarned,
      qualityRating
    };

    this.sessions.update(sessions => [...sessions, session]);

    await this.gamificationService.onPracticeCompleted(session);

    this.resetTimer();

    return session;
  }

  private resetTimer(): void {
    // Stop timer subscription
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }

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

  private startTimerTick(): void {
    // Clear any existing subscription
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // Create interval that ticks every second
    this.timerSubscription = interval(1000).subscribe(() => {
      const state = this.timerState();

      // Only update if running and not paused
      if (!state.isRunning || state.isPaused) {
        return;
      }

      const elapsed = Math.floor((Date.now() - (state.startTime || 0)) / 1000);

      this.timerState.update(s => ({
        ...s,
        elapsedSeconds: elapsed
      }));
    });
  }

  /**
   * Quick log a session without timer
   */
  async quickLogSession(category: string, duration: number, notes?: string, qualityRating?: number): Promise<PracticeSession> {
    const instrument = this.instrumentService.currentInstrument();
    const currentStreak = this.gamificationService.currentStreak();
    const xpEarned = this.xpService.calculateXpForSession(duration, currentStreak);

    const session: PracticeSession = {
      id: this.generateSessionId(),
      instrument,
      date: new Date().toISOString(),
      duration,
      category,
      notes,
      xpEarned,
      qualityRating
    };

    this.sessions.update(sessions => [...sessions, session]);
    await this.gamificationService.onPracticeCompleted(session);

    return session;
  }

  getSessionsByInstrument(instrument: string): PracticeSession[] {
    return this.sessions().filter(s => s.instrument === instrument);
  }

  getTotalPracticeTime(instrument?: string): number {
    const filteredSessions = instrument
      ? this.sessions().filter(s => s.instrument === instrument)
      : this.sessions();

    return filteredSessions.reduce((total, session) => total + session.duration, 0);
  }

  getRecentSessions(days: number, instrument?: string): PracticeSession[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffTime = cutoff.getTime();

    return this.sessions().filter(s => {
      const sessionTime = new Date(s.date).getTime();
      const matchesInstrument = !instrument || s.instrument === instrument;
      return sessionTime >= cutoffTime && matchesInstrument;
    });
  }

  getCategoryGap(category: string, instrument?: string): number {
    const sessions = instrument
      ? this.sessions().filter(s => s.instrument === instrument)
      : this.sessions();

    const categorySessions = sessions.filter(s => s.category === category);
    if (categorySessions.length === 0) return Infinity;

    const lastSession = categorySessions[categorySessions.length - 1];
    const daysSince = Math.floor((Date.now() - new Date(lastSession.date).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince;
  }

  getMostPracticedCategory(days: number, instrument?: string): string | null {
    const recent = this.getRecentSessions(days, instrument);
    if (recent.length === 0) return null;

    const counts = recent.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
