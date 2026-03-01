import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/angular/standalone';
import { PracticeService } from '../../core/services/practice.service';

@Component({
  selector: 'app-progress-stats',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>Progress Stats</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-segment [(ngModel)]="selectedPeriod">
          <ion-segment-button value="week">
            <ion-label>Week</ion-label>
          </ion-segment-button>
          <ion-segment-button value="month">
            <ion-label>Month</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div class="chart">
          @for (bar of chartData(); track bar.label) {
            <div class="bar-container">
              <div class="bar" [style.height.%]="bar.percentage">
                @if (bar.value > 0) {
                  <span class="bar-value">{{ bar.value }}</span>
                }
              </div>
              <span class="bar-label">{{ bar.label }}</span>
            </div>
          }
        </div>

        <div class="comparison">
          <div class="stat">
            <div class="stat-label">This {{ selectedPeriod() }}</div>
            <div class="stat-value">{{ currentPeriodTotal() }}m</div>
          </div>
          <div class="stat">
            <div class="stat-label">Last {{ selectedPeriod() }}</div>
            <div class="stat-value">{{ previousPeriodTotal() }}m</div>
          </div>
          <div class="stat highlight">
            <div class="stat-label">Difference</div>
            <div class="stat-value" [class.positive]="difference() > 0" [class.negative]="difference() < 0">
              {{ difference() > 0 ? '+' : '' }}{{ difference() }}m
            </div>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    ion-segment {
      margin-bottom: 1rem;
    }

    .chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 150px;
      gap: 0.25rem;
      padding: 1rem 0;
      margin-bottom: 1rem;
    }

    .bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .bar {
      width: 100%;
      background: linear-gradient(180deg, var(--ion-color-primary), var(--ion-color-primary-shade));
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 0.25rem;
      min-height: 20px;
      transition: height 0.3s ease;
    }

    .bar-value {
      color: white;
      font-weight: bold;
      font-size: 0.65rem;
    }

    .bar-label {
      margin-top: 0.25rem;
      font-size: 0.65rem;
      color: var(--ion-color-medium);
    }

    .comparison {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      text-align: center;
    }

    .stat {
      padding: 0.75rem;
      background: var(--ion-color-light);
      border-radius: 8px;
    }

    .stat.highlight {
      background: linear-gradient(135deg, rgba(var(--ion-color-primary-rgb), 0.1), rgba(var(--ion-color-secondary-rgb), 0.1));
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--ion-color-medium);
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--ion-color-dark);
    }

    .stat-value.positive {
      color: var(--ion-color-success);
    }

    .stat-value.negative {
      color: var(--ion-color-danger);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel
  ]
})
export class ProgressStatsComponent {
  private practiceService = inject(PracticeService);

  selectedPeriod = signal<'week' | 'month'>('week');

  private sessions = this.practiceService.currentInstrumentSessions;

  chartData = computed(() => {
    const sessions = this.sessions();
    const isWeek = this.selectedPeriod() === 'week';
    const days = isWeek ? 7 : 30;
    const data: { label: string; value: number; percentage: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayMinutes = sessions
        .filter(s => {
          const sessionDate = new Date(s.date);
          return sessionDate >= date && sessionDate < nextDate;
        })
        .reduce((sum, s) => sum + s.duration, 0);

      const label = isWeek 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.getDate().toString();

      data.push({ label, value: dayMinutes, percentage: 0 });
    }

    const maxValue = Math.max(...data.map(d => d.value), 1);
    data.forEach(d => d.percentage = (d.value / maxValue) * 100);

    return data;
  });

  currentPeriodTotal = computed(() => {
    return this.chartData().reduce((sum, d) => sum + d.value, 0);
  });

  previousPeriodTotal = computed(() => {
    const sessions = this.sessions();
    const isWeek = this.selectedPeriod() === 'week';
    const days = isWeek ? 7 : 30;

    let total = 0;
    for (let i = days * 2 - 1; i >= days; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      total += sessions
        .filter(s => {
          const sessionDate = new Date(s.date);
          return sessionDate >= date && sessionDate < nextDate;
        })
        .reduce((sum, s) => sum + s.duration, 0);
    }

    return total;
  });

  difference = computed(() => {
    return this.currentPeriodTotal() - this.previousPeriodTotal();
  });
}
