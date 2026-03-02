// src/app/pages/analytics/analytics.page.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonBadge,
  IonButton,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trendingUp, time, flame, calendar, pieChart, barChart, lockClosed } from 'ionicons/icons';
import { PracticeService } from '../../core/services/practice.service';
import { RevenueCatService } from '../../core/services/revenuecat.service';
import { PaywallModalComponent } from '../../shared/components/paywall-modal.component';

@Component({
  selector: 'app-analytics',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>
          Analytics
          @if (isPro()) {
            <ion-badge color="warning" class="pro-badge">PRO</ion-badge>
          }
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="analytics-container">
        @if (!isPro()) {
          <ion-card class="paywall-card">
            <ion-card-content>
              <ion-icon name="lock-closed" color="warning" size="large"></ion-icon>
              <h2>Advanced Analytics</h2>
              <p>Unlock detailed insights into your practice habits with Pro.</p>
              <ul>
                <li>Practice consistency score</li>
                <li>Category breakdown charts</li>
                <li>Best practice times analysis</li>
                <li>Streak analytics & trends</li>
                <li>Practice heatmap calendar</li>
              </ul>
              <ion-button expand="block" (click)="showPaywall()">
                Upgrade to Pro
              </ion-button>
            </ion-card-content>
          </ion-card>
        } @else {
          <ion-segment [value]="selectedPeriod()" (ionChange)="onPeriodChange($event)">
            <ion-segment-button value="week">
              <ion-label>Week</ion-label>
            </ion-segment-button>
            <ion-segment-button value="month">
              <ion-label>Month</ion-label>
            </ion-segment-button>
            <ion-segment-button value="year">
              <ion-label>Year</ion-label>
            </ion-segment-button>
          </ion-segment>

          <div class="metrics-grid">
            <ion-card class="metric-card">
              <ion-card-content>
                <ion-icon name="time" color="primary"></ion-icon>
                <div class="metric-value">{{ totalMinutes() }}</div>
                <div class="metric-label">Total Minutes</div>
              </ion-card-content>
            </ion-card>

            <ion-card class="metric-card">
              <ion-card-content>
                <ion-icon name="calendar" color="success"></ion-icon>
                <div class="metric-value">{{ totalSessions() }}</div>
                <div class="metric-label">Sessions</div>
              </ion-card-content>
            </ion-card>

            <ion-card class="metric-card">
              <ion-card-content>
                <ion-icon name="trending-up" color="warning"></ion-icon>
                <div class="metric-value">{{ avgSessionLength() }}</div>
                <div class="metric-label">Avg Length</div>
              </ion-card-content>
            </ion-card>

            <ion-card class="metric-card">
              <ion-card-content>
                <ion-icon name="flame" color="danger"></ion-icon>
                <div class="metric-value">{{ consistencyScore() }}%</div>
                <div class="metric-label">Consistency</div>
              </ion-card-content>
            </ion-card>
          </div>

          <ion-card>
            <ion-card-header>
              <ion-card-title>
                <ion-icon name="bar-chart"></ion-icon>
                Practice Heatmap
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="heatmap">
                @for (day of heatmapData(); track day.date) {
                  <div 
                    class="heatmap-cell" 
                    [class.intensity-0]="day.intensity === 0"
                    [class.intensity-1]="day.intensity === 1"
                    [class.intensity-2]="day.intensity === 2"
                    [class.intensity-3]="day.intensity === 3"
                    [class.intensity-4]="day.intensity === 4"
                    [title]="day.label"
                  ></div>
                }
              </div>
              <div class="heatmap-legend">
                <span>Less</span>
                <div class="legend-cells">
                  <div class="legend-cell intensity-0"></div>
                  <div class="legend-cell intensity-1"></div>
                  <div class="legend-cell intensity-2"></div>
                  <div class="legend-cell intensity-3"></div>
                  <div class="legend-cell intensity-4"></div>
                </div>
                <span>More</span>
              </div>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header>
              <ion-card-title>
                <ion-icon name="pie-chart"></ion-icon>
                Category Breakdown
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              @if (categoryData().length === 0) {
                <p class="empty-state">No practice data for this period</p>
              } @else {
                <div class="category-list">
                  @for (cat of categoryData(); track cat.category) {
                    <div class="category-item">
                      <div class="category-info">
                        <span class="category-name">{{ cat.category }}</span>
                        <span class="category-stats">{{ cat.minutes }}m · {{ cat.sessions }} sessions</span>
                      </div>
                      <div class="category-bar-container">
                        <div class="category-bar" [style.width.%]="cat.percentage"></div>
                      </div>
                      <span class="category-percentage">{{ cat.percentage }}%</span>
                    </div>
                  }
                </div>
              }
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header>
              <ion-card-title>
                <ion-icon name="time"></ion-icon>
                Best Practice Times
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="time-chart">
                @for (hour of hourlyData(); track hour.hour) {
                  <div class="time-bar-container">
                    <div class="time-bar" [style.height.%]="hour.percentage">
                      @if (hour.sessions > 0) {
                        <span class="time-value">{{ hour.sessions }}</span>
                      }
                    </div>
                    <span class="time-label">{{ hour.label }}</span>
                  </div>
                }
              </div>
            </ion-card-content>
          </ion-card>

          <ion-card class="insights-card">
            <ion-card-header>
              <ion-card-title>Insights</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="insights">
                @for (insight of insights(); track insight) {
                  <div class="insight-item">
                    <ion-icon name="trending-up" color="primary"></ion-icon>
                    <p>{{ insight }}</p>
                  </div>
                }
              </div>
            </ion-card-content>
          </ion-card>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .analytics-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .pro-badge {
      margin-left: 0.5rem;
      font-size: 0.7rem;
      vertical-align: middle;
    }

    ion-segment {
      margin-bottom: 1rem;
    }

    .paywall-card {
      text-align: center;
      padding: 2rem 1rem;
    }

    .paywall-card ion-icon {
      margin-bottom: 1rem;
    }

    .paywall-card h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .paywall-card p {
      margin-bottom: 1rem;
      color: var(--ion-color-medium);
    }

    .paywall-card ul {
      text-align: left;
      margin: 1rem auto;
      max-width: 300px;
      list-style: none;
      padding: 0;
    }

    .paywall-card li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .paywall-card li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--ion-color-success);
      font-weight: bold;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .metric-card {
      margin: 0;
    }

    .metric-card ion-card-content {
      text-align: center;
      padding: 1rem;
    }

    .metric-card ion-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }

    .metric-label {
      font-size: 0.85rem;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    ion-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    ion-card-title ion-icon {
      font-size: 1.25rem;
    }

    .heatmap {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      margin-bottom: 1rem;
    }

    .heatmap-cell {
      aspect-ratio: 1;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .heatmap-cell:hover {
      transform: scale(1.1);
    }

    .heatmap-cell.intensity-0 {
      background: var(--ion-color-light);
    }

    .heatmap-cell.intensity-1 {
      background: rgba(var(--ion-color-primary-rgb), 0.2);
    }

    .heatmap-cell.intensity-2 {
      background: rgba(var(--ion-color-primary-rgb), 0.4);
    }

    .heatmap-cell.intensity-3 {
      background: rgba(var(--ion-color-primary-rgb), 0.6);
    }

    .heatmap-cell.intensity-4 {
      background: var(--ion-color-primary);
    }

    .heatmap-legend {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--ion-color-medium);
    }

    .legend-cells {
      display: flex;
      gap: 4px;
    }

    .legend-cell {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .category-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
      align-items: center;
    }

    .category-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .category-name {
      font-weight: 600;
    }

    .category-stats {
      font-size: 0.85rem;
      color: var(--ion-color-medium);
    }

    .category-bar-container {
      grid-column: 1 / -1;
      height: 8px;
      background: var(--ion-color-light);
      border-radius: 4px;
      overflow: hidden;
    }

    .category-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--ion-color-primary), var(--ion-color-secondary));
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .category-percentage {
      font-weight: 600;
      color: var(--ion-color-primary);
      min-width: 45px;
      text-align: right;
    }

    .time-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 150px;
      gap: 4px;
      padding: 1rem 0;
    }

    .time-bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .time-bar {
      width: 100%;
      background: linear-gradient(180deg, var(--ion-color-success), var(--ion-color-success-shade));
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 0.25rem;
      min-height: 20px;
      transition: height 0.3s ease;
    }

    .time-value {
      color: white;
      font-weight: bold;
      font-size: 0.65rem;
    }

    .time-label {
      margin-top: 0.25rem;
      font-size: 0.65rem;
      color: var(--ion-color-medium);
    }

    .insights-card {
      background: linear-gradient(135deg, rgba(var(--ion-color-primary-rgb), 0.1), rgba(var(--ion-color-secondary-rgb), 0.1));
    }

    .insights {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .insight-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .insight-item ion-icon {
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .insight-item p {
      margin: 0;
      line-height: 1.5;
    }

    .empty-state {
      text-align: center;
      color: var(--ion-color-medium);
      padding: 2rem;
    }

    @media (min-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonBadge,
    IonButton
  ]
})
export class AnalyticsPage {
  private practiceService = inject(PracticeService);
  private revenueCat = inject(RevenueCatService);
  private modalController = inject(ModalController);

  isPro = this.revenueCat.isPro;
  selectedPeriod = signal<'week' | 'month' | 'year'>('month');

  private sessions = this.practiceService.currentInstrumentSessions;

  private filteredSessions = computed(() => {
    const period = this.selectedPeriod();
    const now = new Date();
    const sessions = this.sessions();

    const cutoff = new Date();
    if (period === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    } else {
      cutoff.setFullYear(now.getFullYear() - 1);
    }

    return sessions.filter(s => new Date(s.date) >= cutoff);
  });

  totalMinutes = computed(() => {
    return this.filteredSessions().reduce((sum, s) => sum + s.duration, 0);
  });

  totalSessions = computed(() => this.filteredSessions().length);

  avgSessionLength = computed(() => {
    const total = this.totalSessions();
    if (total === 0) return 0;
    return Math.round(this.totalMinutes() / total);
  });

  consistencyScore = computed(() => {
    const period = this.selectedPeriod();
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const sessions = this.filteredSessions();
    
    const uniqueDays = new Set(
      sessions.map(s => new Date(s.date).toDateString())
    ).size;

    return Math.round((uniqueDays / days) * 100);
  });

  heatmapData = computed(() => {
    const days = 84;
    const sessions = this.sessions();
    const data: { date: string; intensity: number; label: string }[] = [];

    const sessionsByDate = new Map<string, number>();
    sessions.forEach(s => {
      const key = new Date(s.date).toDateString();
      sessionsByDate.set(key, (sessionsByDate.get(key) || 0) + s.duration);
    });

    const maxMinutes = Math.max(...Array.from(sessionsByDate.values()), 1);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toDateString();
      const minutes = sessionsByDate.get(key) || 0;
      
      let intensity = 0;
      if (minutes > 0) {
        const ratio = minutes / maxMinutes;
        intensity = ratio < 0.2 ? 1 : ratio < 0.4 ? 2 : ratio < 0.6 ? 3 : 4;
      }

      data.push({
        date: key,
        intensity,
        label: `${date.toLocaleDateString()}: ${minutes}m`
      });
    }

    return data;
  });

  categoryData = computed(() => {
    const sessions = this.filteredSessions();
    const categoryMap = new Map<string, { minutes: number; sessions: number }>();

    sessions.forEach(s => {
      const existing = categoryMap.get(s.category) || { minutes: 0, sessions: 0 };
      categoryMap.set(s.category, {
        minutes: existing.minutes + s.duration,
        sessions: existing.sessions + 1
      });
    });

    const total = this.totalMinutes();
    const data = Array.from(categoryMap.entries())
      .map(([category, stats]) => ({
        category,
        minutes: stats.minutes,
        sessions: stats.sessions,
        percentage: total > 0 ? Math.round((stats.minutes / total) * 100) : 0
      }))
      .sort((a, b) => b.minutes - a.minutes);

    return data;
  });

  hourlyData = computed(() => {
    const sessions = this.filteredSessions();
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      sessions: 0,
      label: i === 0 ? '12a' : i < 12 ? `${i}a` : i === 12 ? '12p' : `${i - 12}p`
    }));

    sessions.forEach(s => {
      const hour = new Date(s.date).getHours();
      hours[hour].sessions++;
    });

    const maxSessions = Math.max(...hours.map(h => h.sessions), 1);
    
    return hours
      .filter(h => h.hour >= 6 && h.hour <= 23)
      .map(h => ({
        ...h,
        percentage: (h.sessions / maxSessions) * 100
      }));
  });

  insights = computed(() => {
    const insights: string[] = [];
    const sessions = this.filteredSessions();
    
    if (sessions.length === 0) {
      return ['Start practicing to see personalized insights!'];
    }

    const hourlyData = this.hourlyData();
    const bestHour = hourlyData.reduce((max, h) => h.sessions > max.sessions ? h : max, hourlyData[0]);
    if (bestHour.sessions > 0) {
      insights.push(`You practice most often around ${bestHour.label}. Consider scheduling important practice during this time.`);
    }

    const consistency = this.consistencyScore();
    if (consistency >= 80) {
      insights.push(`Outstanding consistency at ${consistency}%! You're building a strong practice habit.`);
    } else if (consistency >= 50) {
      insights.push(`Good consistency at ${consistency}%. Try practicing on more days to build momentum.`);
    } else {
      insights.push(`Your consistency is ${consistency}%. Set a daily reminder to help build a regular practice habit.`);
    }

    const categories = this.categoryData();
    if (categories.length > 0) {
      const top = categories[0];
      insights.push(`${top.category} is your focus area with ${top.percentage}% of practice time.`);
    }

    const avg = this.avgSessionLength();
    if (avg >= 45) {
      insights.push(`Your average session is ${avg} minutes - great for deep practice!`);
    } else if (avg >= 20) {
      insights.push(`Your average session is ${avg} minutes. Consider longer sessions for complex material.`);
    } else if (avg > 0) {
      insights.push(`Your average session is ${avg} minutes. Short sessions are great for consistency!`);
    }

    return insights;
  });

  constructor() {
    addIcons({ trendingUp, time, flame, calendar, pieChart, barChart, lockClosed });
  }

  onPeriodChange(event: any) {
    this.selectedPeriod.set(event.detail.value);
  }

  async showPaywall() {
    const modal = await this.modalController.create({
      component: PaywallModalComponent,
      componentProps: {
        reason: 'Unlock advanced analytics to gain deep insights into your practice habits.'
      }
    });
    await modal.present();
  }
}
