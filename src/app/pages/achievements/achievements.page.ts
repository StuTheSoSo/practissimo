// src/app/pages/achievements/achievements.page.ts
import { Component, inject, signal, OnInit } from '@angular/core';
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
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonBadge,
  IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, lockClosed } from 'ionicons/icons';
import { AchievementService } from '../../core/services/achievement.service';

@Component({
  selector: 'app-achievements',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Achievements</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment [value]="selectedSegment()" (ionChange)="segmentChanged($event)">
          <ion-segment-button value="all">
            <ion-label>All ({{ totalCount() }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="unlocked">
            <ion-label>Unlocked ({{ unlockedCount() }})</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="achievements-container">
        @if (displayedAchievements().length === 0) {
          <ion-card>
            <ion-card-content>
              <p class="empty-state">No achievements to display. Keep practicing to unlock achievements!</p>
            </ion-card-content>
          </ion-card>
        }

        @for (achievement of displayedAchievements(); track achievement.id) {
          <ion-card [class.unlocked]="achievement.unlocked">
            <ion-card-header>
              <div class="achievement-header">
                <ion-icon
                  [name]="achievement.unlocked ? 'star' : 'lock-closed'"
                  [color]="achievement.unlocked ? 'warning' : 'medium'"
                  size="large"
                ></ion-icon>
                <ion-card-title>{{ achievement.title }}</ion-card-title>
              </div>
            </ion-card-header>
            <ion-card-content>
              <p>{{ achievement.description }}</p>
              @if (!achievement.unlocked) {
                <div class="achievement-progress">
                  <span>{{ achievementService.getAchievementProgress(achievement) }}%</span>
                  <ion-badge color="medium">{{ achievement.xpReward }} XP</ion-badge>
                </div>
                <ion-progress-bar
                  [value]="achievementService.getAchievementProgress(achievement) / 100"
                ></ion-progress-bar>
              } @else {
                <ion-badge color="success">Unlocked!</ion-badge>
                @if (achievement.unlockedAt) {
                  <p class="unlocked-date">{{ formatDate(achievement.unlockedAt) }}</p>
                }
              }
            </ion-card-content>
          </ion-card>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .achievements-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .achievement-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .achievement-progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0 0.5rem 0;
    }

    ion-card.unlocked {
      background: linear-gradient(135deg, var(--ion-color-warning-tint), var(--ion-color-success-tint));
    }

    .empty-state {
      text-align: center;
      color: var(--ion-color-medium);
      padding: 2rem;
    }

    .unlocked-date {
      font-size: 0.85rem;
      color: var(--ion-color-medium);
      margin-top: 0.5rem;
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
    IonButtons,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonBadge,
    IonProgressBar
  ]
})
export class AchievementsPage implements OnInit {
  achievementService = inject(AchievementService);

  allAchievements = this.achievementService.allAchievements;
  unlockedAchievements = this.achievementService.unlockedAchievements;
  lockedAchievements = this.achievementService.lockedAchievements;
  unlockedCount = this.achievementService.unlockedCount;
  totalCount = this.achievementService.totalCount;

  selectedSegment = signal<string>('all');
  displayedAchievements = signal(this.allAchievements());

  constructor() {
    addIcons({ star, lockClosed });
  }

  async ngOnInit() {
    // Check if achievements are empty and initialize if needed
    if (this.allAchievements().length === 0) {
      await this.achievementService.initialize();
    }
    this.updateDisplay();
  }

  segmentChanged(event: any) {
    this.selectedSegment.set(event.detail.value);
    this.updateDisplay();
  }

  private updateDisplay() {
    const segment = this.selectedSegment();
    if (segment === 'unlocked') {
      this.displayedAchievements.set(this.unlockedAchievements());
    } else {
      this.displayedAchievements.set(this.allAchievements());
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
