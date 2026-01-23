// src/app/pages/practice/practice.page.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonItem,
  IonLabel,
  IonNote,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { play, pause, stop, checkmark } from 'ionicons/icons';
import { PracticeService } from '../../core/services/practice.service';
import { InstrumentService } from '../../core/services/instrument.service';
import { QuestService } from '../../core/services/quest.service';
import { AchievementService } from '../../core/services/achievement.service';
import { MetronomeComponent } from '../../shared/components/metronome.component';

@Component({
  selector: 'app-practice',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Practice Session</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="practice-container">
        <!-- Setup Phase -->
        @if (!timerState().isRunning) {
          <ion-card>
            <ion-card-header>
              <ion-card-title>Setup Your Session</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item>
                <ion-label position="stacked">Instrument</ion-label>
                <ion-note>{{ currentInstrument() }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Category *</ion-label>
                <ion-select
                  [value]="selectedCategory"
                  (ionChange)="onCategoryChange($event)"
                  placeholder="Select a category"
                  interface="action-sheet"
                >
                  @for (category of categories(); track category) {
                    <ion-select-option [value]="category">
                      {{ category }}
                    </ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Notes (Optional)</ion-label>
                <ion-textarea
                  [(ngModel)]="sessionNotes"
                  rows="3"
                  placeholder="What will you practice today?"
                ></ion-textarea>
              </ion-item>
            </ion-card-content>
          </ion-card>

          <!-- Metronome (Setup Phase) -->
          <app-metronome></app-metronome>

          <ion-button
            expand="block"
            size="large"
            (click)="startSession()"
          >
            <ion-icon name="play" slot="start"></ion-icon>
            Start Practice
          </ion-button>
        }

        <!-- Practice Phase -->
        @if (timerState().isRunning) {
          <ion-card class="timer-card">
            <ion-card-header>
              <ion-card-title>{{ currentCategory() }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="timer-display">
                <h1>{{ formattedTime() }}</h1>
                <p>{{ elapsedMinutes() }} minutes</p>
              </div>

              <div class="timer-controls">
                @if (!timerState().isPaused) {
                  <ion-button (click)="pauseSession()" expand="block">
                    <ion-icon name="pause" slot="start"></ion-icon>
                    Pause
                  </ion-button>
                } @else {
                  <ion-button (click)="resumeSession()" expand="block" color="success">
                    <ion-icon name="play" slot="start"></ion-icon>
                    Resume
                  </ion-button>
                }

                <ion-button (click)="confirmStopSession()" expand="block" color="danger">
                  <ion-icon name="stop" slot="start"></ion-icon>
                  Complete Session
                </ion-button>
              </div>

              @if (sessionNotes()) {
                <div class="session-notes">
                  <ion-label>
                    <strong>Notes:</strong>
                    <p>{{ sessionNotes() }}</p>
                  </ion-label>
                </div>
              }
            </ion-card-content>
          </ion-card>

          <!-- Metronome (Practice Phase) -->
          <app-metronome></app-metronome>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .practice-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .timer-card {
      text-align: center;
    }

    .timer-display {
      margin: 2rem 0;
    }

    .timer-display h1 {
      font-size: 4rem;
      font-weight: bold;
      margin: 0;
      font-variant-numeric: tabular-nums;
    }

    .timer-display p {
      font-size: 1.2rem;
      color: var(--ion-color-medium);
      margin: 0.5rem 0 0 0;
    }

    .timer-controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
    }

    .session-notes {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--ion-color-light);
      border-radius: 8px;
      text-align: left;
    }

    .session-notes p {
      margin: 0.5rem 0 0 0;
      white-space: pre-wrap;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonButtons,
    IonBackButton,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonItem,
    IonLabel,
    IonNote,
    MetronomeComponent
  ]
})
export class PracticePage {
  private router = inject(Router);
  private alertController = inject(AlertController);
  private practiceService = inject(PracticeService);
  private instrumentService = inject(InstrumentService);
  private questService = inject(QuestService);
  private achievementService = inject(AchievementService);

  currentInstrument = this.instrumentService.currentDisplayName;
  categories = this.instrumentService.currentCategories;

  timerState = this.practiceService.timer;
  currentCategory = this.practiceService.category;
  formattedTime = this.practiceService.formattedTime;
  elapsedMinutes = this.practiceService.elapsedMinutes;
  sessionNotes = this.practiceService.notes;

  selectedCategory: string = '';

  constructor() {
    addIcons({ play, pause, stop, checkmark });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    console.log('Category selected:', this.selectedCategory);
  }

  async startSession() {
    console.log('Start session clicked, category:', this.selectedCategory);

    if (!this.selectedCategory) {
      console.log('No category selected');
      const alert = await this.alertController.create({
        header: 'Category Required',
        message: 'Please select a practice category before starting your session.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.practiceService.setCategory(this.selectedCategory);
    this.practiceService.setNotes(this.sessionNotes() || '');

    console.log('Starting timer with category:', this.selectedCategory);
    this.practiceService.startTimer();

    console.log('Timer state after start:', this.timerState());
  }

  pauseSession() {
    this.practiceService.pauseTimer();
  }

  resumeSession() {
    this.practiceService.resumeTimer();
  }

  async confirmStopSession() {
    const minutes = this.elapsedMinutes();

    if (minutes < 1) {
      const alert = await this.alertController.create({
        header: 'Practice for at least 1 minute',
        message: 'Sessions must be at least 1 minute long to count.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Complete Session?',
      message: `You practiced for ${minutes} minute${minutes !== 1 ? 's' : ''}. Save this session?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Complete',
          handler: () => this.stopSession()
        }
      ]
    });

    await alert.present();
  }

  async stopSession() {
    const session = await this.practiceService.stopTimer();

    await this.questService.onPracticeCompleted(session);

    const newAchievements = await this.achievementService.checkAchievements();

    const alert = await this.alertController.create({
      header: 'Session Complete!',
      message: `You earned ${session.xpEarned} XP!${newAchievements.length > 0 ? ` 🎉 ${newAchievements.length} new achievement${newAchievements.length !== 1 ? 's' : ''} unlocked!` : ''}`,
      buttons: ['Awesome!']
    });

    await alert.present();
    await alert.onDidDismiss();

    this.router.navigate(['/home']);
  }
}
