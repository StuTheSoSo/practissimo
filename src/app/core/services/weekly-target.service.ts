import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { PracticeSession } from '../models/practice-session.model';
import { STORAGE_KEYS } from '../models/storage-keys.model';
import { WeeklyTarget } from '../models/weekly-target.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WeeklyTargetService {
  private readonly DEFAULT_TARGET_MINUTES = 120;

  private storage = inject(StorageService);

  private targetState = signal<WeeklyTarget>(this.createInitialState());

  readonly weeklyTarget = this.targetState.asReadonly();
  readonly targetMinutes = computed(() => this.targetState().targetMinutes);
  readonly minutesCompleted = computed(() => this.targetState().minutesCompleted);
  readonly sessionsCompleted = computed(() => this.targetState().sessionsCompleted);
  readonly remainingMinutes = computed(() =>
    Math.max(0, this.targetState().targetMinutes - this.targetState().minutesCompleted)
  );
  readonly progressPercent = computed(() => {
    const state = this.targetState();
    if (state.targetMinutes <= 0) return 0;
    return Math.min(100, Math.round((state.minutesCompleted / state.targetMinutes) * 100));
  });
  readonly isCompleted = computed(() =>
    this.targetState().minutesCompleted >= this.targetState().targetMinutes
  );
  readonly weekRangeLabel = computed(() => {
    const start = this.parseLocalDate(this.targetState().weekStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatter = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric'
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  });

  constructor() {
    effect(() => {
      const data = this.targetState();
      this.storage.set(STORAGE_KEYS.WEEKLY_TARGET, data);
    });
  }

  async initialize(): Promise<void> {
    const savedTarget = await this.storage.get<WeeklyTarget>(STORAGE_KEYS.WEEKLY_TARGET);

    if (!savedTarget) {
      this.targetState.set(this.createInitialState());
      return;
    }

    this.targetState.set(this.normalizeForCurrentWeek(savedTarget));
  }

  onPracticeCompleted(session: PracticeSession): void {
    const sessionWeekStart = this.getWeekStartDateString(new Date(session.date));
    const currentWeekStart = this.getWeekStartDateString(new Date());

    if (sessionWeekStart !== currentWeekStart) {
      return;
    }

    this.targetState.update(state => {
      const normalized = this.normalizeForCurrentWeek(state);
      return {
        ...normalized,
        minutesCompleted: normalized.minutesCompleted + Math.max(0, session.duration),
        sessionsCompleted: normalized.sessionsCompleted + 1,
        lastUpdatedAt: new Date().toISOString()
      };
    });
  }

  setTargetMinutes(minutes: number): void {
    const nextTarget = Math.max(10, Math.floor(minutes));

    this.targetState.update(state => {
      const normalized = this.normalizeForCurrentWeek(state);
      return {
        ...normalized,
        targetMinutes: nextTarget,
        lastUpdatedAt: new Date().toISOString()
      };
    });
  }

  private createInitialState(): WeeklyTarget {
    return {
      weekStartDate: this.getWeekStartDateString(new Date()),
      targetMinutes: this.DEFAULT_TARGET_MINUTES,
      minutesCompleted: 0,
      sessionsCompleted: 0,
      lastUpdatedAt: new Date().toISOString()
    };
  }

  private normalizeForCurrentWeek(state: WeeklyTarget): WeeklyTarget {
    const currentWeekStart = this.getWeekStartDateString(new Date());

    if (state.weekStartDate === currentWeekStart) {
      return state;
    }

    return {
      weekStartDate: currentWeekStart,
      targetMinutes: state.targetMinutes || this.DEFAULT_TARGET_MINUTES,
      minutesCompleted: 0,
      sessionsCompleted: 0,
      lastUpdatedAt: new Date().toISOString()
    };
  }

  private getWeekStartDateString(date: Date): string {
    const local = new Date(date);
    local.setHours(0, 0, 0, 0);
    const day = local.getDay(); // Sunday = 0
    const diffToMonday = (day + 6) % 7;
    local.setDate(local.getDate() - diffToMonday);

    return this.formatLocalDate(local);
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
  }
}
