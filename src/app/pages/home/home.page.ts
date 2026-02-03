// src/app/pages/home/home.page.ts
import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
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
  IonIcon,
  IonProgressBar,
  IonBadge,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  flame,
  trophy,
  star,
  play,
  settings,
  calendar,
  chevronForward,
  musicalNotes,
  musicalNote
} from 'ionicons/icons';
import { GamificationService } from '../../core/services/gamification.service';
import { InstrumentService } from '../../core/services/instrument.service';
import { QuestService } from '../../core/services/quest.service';
import { FeedbackModalComponent } from 'src/app/shared/components/feedback.component';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>PracticeQuest</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="goToSettings()">
            <ion-icon name="settings" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="home-container">
        <!-- Instrument Header -->
        <div class="instrument-header">
          <h2>{{ currentInstrument() }}</h2>
          <ion-badge color="primary">Level {{ level() }}</ion-badge>
        </div>

        <!-- Streak Card -->
        <ion-card class="streak-card">
          <ion-card-header>
            <div class="streak-header">
              <ion-icon name="flame" color="danger"></ion-icon>
              <ion-card-title>{{ currentStreak() }} Day Streak</ion-card-title>
            </div>
          </ion-card-header>
          <ion-card-content>
            <p class="streak-status">{{ streakMessage() }}</p>
            @if (longestStreak() > currentStreak()) {
              <p class="longest-streak">Personal Best: {{ longestStreak() }} days</p>
            }
          </ion-card-content>
        </ion-card>

        <!-- XP Progress Card -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Level Progress</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="xp-info">
              <span>{{ levelInfo().currentXp }} / {{ levelInfo().xpForNextLevel - levelInfo().xpForCurrentLevel }} XP</span>
              <span>{{ levelInfo().progressPercent }}%</span>
            </div>
            <ion-progress-bar [value]="levelInfo().progressPercent / 100"></ion-progress-bar>
          </ion-card-content>
        </ion-card>

        <!-- Quick Actions -->
        <ion-grid class="quick-actions">
          <ion-row>
            <ion-col size="12">
             <ion-button expand="block" (click)="startPractice()">
              <ion-icon name="play" slot="start"></ion-icon>
              Start Practice
            </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <ion-button expand="block" fill="outline" (click)="goToQuests()">
                <ion-icon name="trophy" slot="start"></ion-icon>
                Quests
                @if (activeQuestsCount() > 0) {
                  <ion-badge color="danger">{{ activeQuestsCount() }}</ion-badge>
                }
              </ion-button>
            </ion-col>
            <ion-col size="6">
              <ion-button expand="block" fill="outline" (click)="goToTuner()">
                <ion-icon name="musical-note" slot="start"></ion-icon>
                Tuner
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <ion-button expand="block" fill="outline" (click)="goToAchievements()">
                <ion-icon name="star" slot="start"></ion-icon>
                Achievements
              </ion-button>
            </ion-col>
       <ion-col size="6">
              <ion-button expand="block" fill="outline" (click)="goToChordCharts()">
                <ion-icon name="musical-notes" slot="start"></ion-icon>
                Chord Charts
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12">
              <ion-button expand="block" fill="clear" (click)="goToHistory()">
                <ion-icon name="calendar" slot="start"></ion-icon>
                View History
                <ion-icon name="chevron-forward" slot="end"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Today's Quests Preview -->
        @if (todaysQuests().length > 0) {
          <ion-card>
            <ion-card-header>
              <ion-card-title>Today's Quests</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                @for (quest of todaysQuests().slice(0, 3); track quest.id) {
                  <ion-item>
                    <ion-label>
                      <h3>{{ quest.title }}</h3>
                      <p>{{ quest.progress }} / {{ quest.target }}</p>
                    </ion-label>
                    <ion-badge [color]="quest.completed ? 'success' : 'medium'" slot="end">
                      {{ quest.completed ? 'Complete' : quest.xpReward + ' XP' }}
                    </ion-badge>
                  </ion-item>
                }
              </ion-list>
              @if (todaysQuests().length > 3) {
                <ion-button expand="block" fill="clear" (click)="goToQuests()">
                  View All Quests ({{ todaysQuests().length }})
                </ion-button>
              }
            </ion-card-content>
          </ion-card>
        }

        <!-- Feedback Section -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Help Us Improve</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Your feedback is invaluable! Report bugs, request features, or share your thoughts.</p>

            <!-- Direct feedback button instead of component -->
            <ion-button
              expand="block"
              fill="solid"
              (click)="openFeedback()"
            >
              <ion-icon name="chatbubble-ellipses" slot="start"></ion-icon>
              Send Feedback
            </ion-button>

            <!-- Quick Links -->
            <div class="feedback-links">
              <ion-button fill="clear" size="small" (click)="openFeedbackWithType('bug')">
                <ion-icon name="bug" slot="start"></ion-icon>
                Report Bug
              </ion-button>
              <ion-button fill="clear" size="small" (click)="openFeedbackWithType('feature')">
                <ion-icon name="bulb" slot="start"></ion-icon>
                Request Feature
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

      </div>
    </ion-content>
  `,
  styles: [`
    .home-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .instrument-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .instrument-header h2 {
      margin: 0;
    }

    .streak-card {
      background: linear-gradient(135deg, var(--ion-color-primary-tint), var(--ion-color-secondary-tint));
    }

    .streak-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .streak-header ion-icon {
      font-size: 2rem;
    }

    .streak-status {
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }

    .longest-streak {
      color: var(--ion-color-medium);
      font-size: 0.9rem;
      margin: 0;
    }

    .xp-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .quick-actions {
      margin: 1rem 0;
    }

    .quick-actions ion-button {
      margin: 0;
    }

    .ion-list {
      padding: 0;
    }

        .feedback-links {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .feedback-links ion-button {
      flex: 1;
      min-width: 140px;
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
    IonIcon,
    IonProgressBar,
    IonBadge,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class HomePage {
  private router = inject(Router);
  private gamificationService = inject(GamificationService);
  private instrumentService = inject(InstrumentService);
  private questService = inject(QuestService);
  private modalController = inject(ModalController);

  currentInstrument = this.instrumentService.currentDisplayName;
  currentStreak = this.gamificationService.currentStreak;
  longestStreak = this.gamificationService.longestStreak;
  level = this.gamificationService.level;
  levelInfo = this.gamificationService.levelInfo;

  todaysQuests = this.questService.currentInstrumentQuests;
  activeQuestsCount = computed(() => this.todaysQuests().filter(q => !q.completed).length);

  streakMessage = computed(() => {
    const status = this.gamificationService.getStreakStatus();
    switch (status) {
      case 'active':
        return "Great job! You've practiced today!";
      case 'at_risk':
        return "Don't forget to practice today!";
      case 'broken':
        return "Start a new streak today!";
    }
  });

  constructor() {
    addIcons({ flame, trophy, star, play, settings, calendar, chevronForward, musicalNotes, musicalNote });
  }

  startPractice() {
    this.router.navigate(['/practice']);
  }

  goToChordCharts() {
    this.router.navigate(['/chord-charts']);
  }

  // goToBackingTracks() {
  //   this.router.navigate(['/backing-tracks']);
  // }

  goToTuner() {
    this.router.navigate(['/tuner']);
  }

  goToQuests() {
    this.router.navigate(['/quests']);
  }

  goToAchievements() {
    this.router.navigate(['/achievements']);
  }

  goToHistory() {
    this.router.navigate(['/history']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  async openFeedback() {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent
    });
    await modal.present();
  }

  async openFeedbackWithType(type: 'bug' | 'feature') {
    // Open feedback modal - you could pass the type as componentProps if needed
    const modal = await this.modalController.create({
      component: FeedbackModalComponent,
      componentProps: {
        initialType: type
      }
    });
    await modal.present();
  }
}
