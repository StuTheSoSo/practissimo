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
  ModalController,
  AlertController
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
            <ion-card class="metric-card" (click)="showMetricDetails('minutes')">
              <ion-card-content>
                <ion-icon name="time" color="primary"></ion-icon>
                <div class="metric-value">{{ totalMinutes() }}</div>
                <div class="metric-label">Total Minutes</div>
              </ion-card-content>
            </ion-card>

            <ion-card class="metric-card" (click)="showMetricDetails('sessions')">
              <ion-card-content>
                <ion-icon name="calendar" color="success"></ion-icon>
                <div class="metric-value">{{ totalSessions() }}</div>
                <div class="metric-label">Sessions</div>
              </ion-card-content>
            </ion-card>

            <ion-card class="metric-card" (click)="showMetricDetails('average')">
              <ion-card-content>
                <ion-icon name="trending-up" color="warning"></ion-icon>
                <div class="metric-value">{{ avgSessionLength() }}</div>
                <div class="metric-label">Avg Length</div>
              </ion-card-content>
            </ion-card>

            <ion-card class="metric-card" (click)="showMetricDetails('consistency')">
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
                <ion-icon name="star"></ion-icon>
                Practice Quality Trends
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              @if (qualityData().totalRated === 0) {
                <p class="empty-state">Start rating your sessions to see quality trends</p>
              } @else {
                <div class="quality-overview">
                  <div class="quality-stat">
                    <div class="quality-stat-value">{{ qualityData().averageRating }}</div>
                    <div class="quality-stat-label">Average Rating</div>
                  </div>
                  <div class="quality-stat">
                    <div class="quality-stat-value">{{ qualityData().totalRated }}</div>
                    <div class="quality-stat-label">Rated Sessions</div>
                  </div>
                  <div class="quality-stat">
                    <div class="quality-stat-value" [class.trend-up]="qualityData().trend === 'improving'" [class.trend-down]="qualityData().trend === 'declining'">
                      {{ qualityData().trend === 'improving' ? '↗' : qualityData().trend === 'declining' ? '↘' : '→' }}
                    </div>
                    <div class="quality-stat-label">Trend</div>
                  </div>
                </div>

                <div class="quality-distribution">
                  <div class="distribution-label">Rating Distribution</div>
                  @for (rating of [5,4,3,2,1]; track rating) {
                    <div class="distribution-row">
                      <div class="distribution-stars">
                        @for (star of [1,2,3,4,5]; track star) {
                          <ion-icon [name]="star <= rating ? 'star' : 'star-outline'" size="small" color="warning"></ion-icon>
                        }
                      </div>
                      <div class="distribution-bar-container">
                        <div class="distribution-bar" [style.width.%]="qualityData().distribution[rating] || 0"></div>
                      </div>
                      <span class="distribution-count">{{ qualityData().counts[rating] || 0 }}</span>
                    </div>
                  }
                </div>

                @if (qualityByCategory().length > 0) {
                  <div class="quality-by-category">
                    <div class="category-quality-label">Quality by Category</div>
                    @for (cat of qualityByCategory(); track cat.category) {
                      <div class="category-quality-item">
                        <span class="category-quality-name">{{ cat.category }}</span>
                        <div class="category-quality-rating">
                          <span class="category-quality-value">{{ cat.avgRating }}</span>
                          @for (star of [1,2,3,4,5]; track star) {
                            <ion-icon [name]="star <= parseFloat(cat.avgRating) ? 'star' : 'star-outline'" size="small" color="warning"></ion-icon>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              }
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
      cursor: pointer;
      transition: transform 0.2s;
    }

    .metric-card:active {
      transform: scale(0.98);
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

    .category-quality-value {
      font-weight: 700;
      color: var(--ion-color-warning);
      min-width: 30px;
      text-align: right;
    }

    .quality-overview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .quality-stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--ion-color-primary);
    }

    .quality-stat-value.trend-up {
      color: var(--ion-color-success);
    }

    .quality-stat-value.trend-down {
      color: var(--ion-color-danger);
    }

    .quality-stat-label {
      font-size: 0.8rem;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }

    .quality-distribution {
      margin-bottom: 1.5rem;
    }

    .distribution-label,
    .category-quality-label {
      font-weight: 700;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }

    .distribution-row {
      display: grid;
      grid-template-columns: 100px 1fr 40px;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .distribution-stars {
      display: flex;
      gap: 2px;
    }

    .distribution-bar-container {
      height: 20px;
      background: var(--ion-color-light);
      border-radius: 4px;
      overflow: hidden;
    }

    .distribution-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--ion-color-warning), var(--ion-color-warning-shade));
      transition: width 0.5s ease;
    }

    .distribution-count {
      font-weight: 600;
      text-align: right;
      color: var(--ion-color-medium);
    }

    .quality-by-category {
      padding-top: 1rem;
      border-top: 1px solid var(--ion-color-light);
    }

    .category-quality-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
    }

    .category-quality-name {
      font-weight: 600;
    }

    .category-quality-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
  private alertController = inject(AlertController);

  isPro = this.revenueCat.isPro;
  selectedPeriod = signal<'week' | 'month' | 'year'>('month');

  parseFloat = parseFloat;

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

  qualityData = computed(() => {
    const sessions = this.filteredSessions().filter(s => s.qualityRating);
    const totalRated = sessions.length;
    
    if (totalRated === 0) {
      return {
        averageRating: '0.0',
        totalRated: 0,
        trend: 'stable' as 'improving' | 'declining' | 'stable',
        distribution: {} as Record<number, number>,
        counts: {} as Record<number, number>
      };
    }

    const avgRating = (sessions.reduce((sum, s) => sum + (s.qualityRating || 0), 0) / totalRated).toFixed(1);
    
    const midpoint = Math.floor(totalRated / 2);
    const firstHalf = sessions.slice(0, midpoint);
    const secondHalf = sessions.slice(midpoint);
    
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, s) => sum + (s.qualityRating || 0), 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, s) => sum + (s.qualityRating || 0), 0) / secondHalf.length : 0;
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondAvg > firstAvg + 0.3) trend = 'improving';
    else if (secondAvg < firstAvg - 0.3) trend = 'declining';

    const counts: Record<number, number> = {};
    sessions.forEach(s => {
      const rating = s.qualityRating || 0;
      counts[rating] = (counts[rating] || 0) + 1;
    });

    const distribution: Record<number, number> = {};
    Object.keys(counts).forEach(key => {
      const rating = parseInt(key);
      distribution[rating] = Math.round((counts[rating] / totalRated) * 100);
    });

    return { averageRating: avgRating, totalRated, trend, distribution, counts };
  });

  qualityByCategory = computed(() => {
    const sessions = this.filteredSessions().filter(s => s.qualityRating);
    const categoryMap = new Map<string, { total: number; count: number }>();

    sessions.forEach(s => {
      const existing = categoryMap.get(s.category) || { total: 0, count: 0 };
      categoryMap.set(s.category, {
        total: existing.total + (s.qualityRating || 0),
        count: existing.count + 1
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, stats]) => ({
        category,
        avgRating: (stats.total / stats.count).toFixed(1)
      }))
      .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating));
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

  async showMetricDetails(type: 'minutes' | 'sessions' | 'average' | 'consistency') {
    const sessions = this.filteredSessions();
    const period = this.selectedPeriod();
    const periodLabel = period === 'week' ? 'week' : period === 'month' ? 'month' : 'year';
    
    let header = '';
    let message = '';

    if (type === 'minutes') {
      const total = this.totalMinutes();
      const dailyAvg = period === 'week' ? Math.round(total / 7) : period === 'month' ? Math.round(total / 30) : Math.round(total / 365);
      const longest = sessions.length > 0 ? Math.max(...sessions.map(s => s.duration)) : 0;
      header = 'Total Minutes';
      message = `You've practiced ${total} minutes this ${periodLabel}.\n\nDaily average: ${dailyAvg} min\nLongest session: ${longest} min`;
    } else if (type === 'sessions') {
      const total = this.totalSessions();
      const uniqueDays = new Set(sessions.map(s => new Date(s.date).toDateString())).size;
      const avgPerDay = uniqueDays > 0 ? (total / uniqueDays).toFixed(1) : '0';
      header = 'Total Sessions';
      message = `You've completed ${total} practice session${total !== 1 ? 's' : ''} this ${periodLabel}.\n\nPractice days: ${uniqueDays}\nAvg sessions per day: ${avgPerDay}`;
    } else if (type === 'average') {
      const avg = this.avgSessionLength();
      const shortest = sessions.length > 0 ? Math.min(...sessions.map(s => s.duration)) : 0;
      const longest = sessions.length > 0 ? Math.max(...sessions.map(s => s.duration)) : 0;
      header = 'Average Session Length';
      message = `Your average session is ${avg} minutes.\n\nShortest: ${shortest} min\nLongest: ${longest} min\n\nTip: ${avg >= 30 ? 'Great session length for deep practice!' : 'Consider longer sessions for complex material.'}`;
    } else {
      const score = this.consistencyScore();
      const uniqueDays = new Set(sessions.map(s => new Date(s.date).toDateString())).size;
      const totalDays = period === 'week' ? 7 : period === 'month' ? 30 : 365;
      header = 'Consistency Score';
      message = `You practiced on ${uniqueDays} out of ${totalDays} days (${score}%).\n\n${score >= 80 ? 'Outstanding! You\'re building a strong habit.' : score >= 50 ? 'Good progress! Try practicing more days.' : 'Set daily reminders to build consistency.'}`;
    }

    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
