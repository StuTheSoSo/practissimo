
// src/app/pages/history/history.page.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, chevronForward, time } from 'ionicons/icons';
import { PracticeService } from '../../core/services/practice.service';
import { PracticeSession } from '../../core/models/practice-session.model';

type CalendarDay = {
  date: Date | null;
  key: string | null;
  dayNumber: number | null;
  isToday: boolean;
  isSelected: boolean;
  totalMinutes: number;
  sessionsCount: number;
};

@Component({
  selector: 'app-history',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Practice History</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="history-container">
        <ion-card class="calendar-card">
          <ion-card-header>
            <div class="calendar-header">
              <ion-button fill="clear" size="small" (click)="previousMonth()">
                <ion-icon name="chevron-back"></ion-icon>
              </ion-button>
              <ion-card-title class="month-label">{{ monthLabel() }}</ion-card-title>
              <ion-button fill="clear" size="small" (click)="nextMonth()">
                <ion-icon name="chevron-forward"></ion-icon>
              </ion-button>
            </div>
          </ion-card-header>
          <ion-card-content>
            <div class="weekday-row">
              @for (weekday of weekdays; track weekday) {
                <div class="weekday">{{ weekday }}</div>
              }
            </div>
            <div class="calendar-grid">
              @for (day of calendarDays(); track day.key ?? $index) {
                <button
                  class="calendar-day"
                  [class.is-empty]="!day.date"
                  [class.is-today]="day.isToday"
                  [class.is-selected]="day.isSelected"
                  [class.has-sessions]="day.sessionsCount > 0"
                  (click)="selectDay(day)"
                  [disabled]="!day.date"
                >
                  <span class="day-number">{{ day.dayNumber }}</span>
                  @if (day.sessionsCount > 0) {
                    <span class="day-meta">
                      {{ day.totalMinutes }}m
                    </span>
                  }
                </button>
              }
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="day-details">
          <ion-card-header>
            <ion-card-title>
              {{ selectedDateLabel() }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            @if (selectedDateSessions().length === 0) {
              <p class="empty-state">No practice sessions for this day.</p>
            } @else {
              <div class="day-summary">
                <ion-icon name="time"></ion-icon>
                <span>{{ selectedDateTotalMinutes() }} minutes practiced</span>
              </div>
              <ion-list>
                @for (session of selectedDateSessions(); track session.id) {
                  <ion-item>
                    <ion-label>
                      <h3>{{ session.category }}</h3>
                      <p>{{ formatTime(session.date) }} · {{ session.duration }} min</p>
                      @if (session.notes) {
                        <p class="notes">{{ session.notes }}</p>
                      }
                    </ion-label>
                    <ion-badge color="primary" slot="end">{{ session.xpEarned }} XP</ion-badge>
                  </ion-item>
                }
              </ion-list>
            }
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .history-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .empty-state {
      text-align: center;
      color: var(--ion-color-medium);
    }

    ion-list {
      padding: 0;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }

    .calendar-card {
      margin-bottom: 16px;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .month-label {
      text-align: center;
      flex: 1;
      font-weight: 600;
    }

    .weekday-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      margin-bottom: 8px;
      font-size: 0.8rem;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .weekday {
      text-align: center;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
    }

    .calendar-day {
      appearance: none;
      border: 1px solid var(--ion-color-step-200);
      border-radius: 10px;
      padding: 8px 4px;
      min-height: 56px;
      width: 100%;
      background: var(--ion-background-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 0.85rem;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
    }

    .calendar-day.is-empty {
      border: none;
      background: transparent;
    }

    .calendar-day.has-sessions {
      border-color: var(--ion-color-primary);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    }

    .calendar-day.is-selected {
      border-color: var(--ion-color-primary);
      background: rgba(var(--ion-color-primary-rgb), 0.08);
      transform: translateY(-2px);
    }

    .calendar-day.is-today {
      border-color: var(--ion-color-tertiary);
    }

    .calendar-day:disabled {
      opacity: 0.35;
    }

    .day-number {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .day-meta {
      font-size: 0.7rem;
      color: var(--ion-color-medium);
    }

    .day-details ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }

    .day-summary {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--ion-color-primary);
    }

    .notes {
      color: var(--ion-color-medium);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge
  ]
})
export class HistoryPage {
  private practiceService = inject(PracticeService);

  sessions = this.practiceService.currentInstrumentSessions;
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private selectedMonth = signal(this.startOfMonth(new Date()));
  private selectedDateKey = signal<string | null>(null);

  private sessionsByDate = computed(() => this.groupSessionsByDate(this.sessions()));

  monthLabel = computed(() => {
    const date = this.selectedMonth();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calendarDays = computed<CalendarDay[]>(() => {
    const monthStart = this.selectedMonth();
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const todayKey = this.toDateKey(new Date());
    const selectedKey = this.selectedDateKey();
    const grouped = this.sessionsByDate();

    const days: CalendarDay[] = [];

    for (let i = 0; i < totalCells; i += 1) {
      const dayNumber = i - firstDayOfWeek + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        days.push({
          date: null,
          key: null,
          dayNumber: null,
          isToday: false,
          isSelected: false,
          totalMinutes: 0,
          sessionsCount: 0
        });
        continue;
      }

      const date = new Date(year, month, dayNumber);
      const key = this.toDateKey(date);
      const sessions = grouped.get(key) ?? [];
      const totalMinutes = sessions.reduce((total, session) => total + session.duration, 0);

      days.push({
        date,
        key,
        dayNumber,
        isToday: key === todayKey,
        isSelected: key === selectedKey,
        totalMinutes,
        sessionsCount: sessions.length
      });
    }

    return days;
  });

  selectedDateSessions = computed(() => {
    const key = this.selectedDateKey();
    if (!key) {
      return [];
    }
    const sessions = this.sessionsByDate().get(key) ?? [];
    return [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  });

  selectedDateTotalMinutes = computed(() => {
    return this.selectedDateSessions().reduce((total, session) => total + session.duration, 0);
  });

  selectedDateLabel = computed(() => {
    const key = this.selectedDateKey();
    if (!key) {
      return 'Select a day';
    }
    const date = new Date(`${key}T00:00:00`);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  });

  constructor() {
    addIcons({ chevronBack, chevronForward, time });

    effect(() => {
      const sessions = this.sessions();
      const currentSelection = this.selectedDateKey();
      if (currentSelection) {
        return;
      }

      const todayKey = this.toDateKey(new Date());
      const hasToday = sessions.some(session => this.toDateKey(new Date(session.date)) === todayKey);
      if (hasToday) {
        this.selectedDateKey.set(todayKey);
        this.selectedMonth.set(this.startOfMonth(new Date()));
        return;
      }

      if (sessions.length > 0) {
        const mostRecent = [...sessions].sort((a, b) => a.date.localeCompare(b.date)).pop();
        if (mostRecent) {
          const date = new Date(mostRecent.date);
          this.selectedDateKey.set(this.toDateKey(date));
          this.selectedMonth.set(this.startOfMonth(date));
        }
      }
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  previousMonth(): void {
    const current = this.selectedMonth();
    this.selectedMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.selectedMonth();
    this.selectedMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectDay(day: CalendarDay): void {
    if (!day.date || !day.key) {
      return;
    }
    this.selectedDateKey.set(day.key);
  }

  private groupSessionsByDate(sessions: PracticeSession[]): Map<string, PracticeSession[]> {
    const map = new Map<string, PracticeSession[]>();
    for (const session of sessions) {
      const key = this.toDateKey(new Date(session.date));
      const existing = map.get(key);
      if (existing) {
        existing.push(session);
      } else {
        map.set(key, [session]);
      }
    }
    return map;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
}
