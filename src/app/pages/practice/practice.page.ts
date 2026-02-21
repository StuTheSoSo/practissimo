// src/app/pages/practice/practice.page.ts
import { Component, effect, inject, OnDestroy } from '@angular/core';
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
import { WeeklyTargetService } from '../../core/services/weekly-target.service';
import { NotificationService } from '../../core/services/notification.service';
import { MetronomeService } from '../../core/services/metronome.service';
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
          <ion-card class="setup-card">
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

          <ion-button
            class="start-session-button"
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
        }

        <!-- Persistent Metronome -->
        <app-metronome></app-metronome>
      </div>
    </ion-content>
  `,
  styles: [`
    .practice-container {
      max-width: 600px;
      margin: 0 auto;
      color: #0f172a;
    }

    .practice-container ion-card {
      --color: #0f172a;
      color: #0f172a;
      border-radius: 18px;
      border: 1px solid rgba(131, 161, 220, 0.28);
      box-shadow: 0 10px 22px rgba(62, 85, 135, 0.12);
    }

    .setup-card {
      background:
        radial-gradient(circle at 95% 8%, rgba(173, 190, 255, 0.25), transparent 38%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(245, 250, 255, 0.97));
    }

    .practice-container ion-item {
      --color: #1f2937;
      --background: transparent;
    }

    .practice-container ion-card-title {
      color: #0f172a;
      font-weight: 800;
    }

    .practice-container ion-label {
      color: #1f2937;
      font-weight: 700;
    }

    .practice-container ion-label[position='stacked'] {
      color: #111827;
      font-weight: 800;
    }

    .practice-container ion-note {
      color: #334155;
      font-weight: 600;
    }

    .timer-card {
      text-align: center;
      background:
        radial-gradient(circle at 8% 0%, rgba(186, 247, 229, 0.32), transparent 35%),
        radial-gradient(circle at 95% 10%, rgba(173, 190, 255, 0.24), transparent 40%),
        linear-gradient(180deg, rgba(254, 255, 255, 0.98), rgba(246, 251, 255, 0.98));
    }

    .timer-display {
      margin: 2rem 0;
    }

    .timer-display h1 {
      font-size: 3.8rem;
      font-weight: bold;
      margin: 0;
      font-variant-numeric: tabular-nums;
      color: #122343;
      letter-spacing: 0.02em;
    }

    .timer-display p {
      font-size: 1.2rem;
      color: #334155;
      font-weight: 700;
      margin: 0.5rem 0 0 0;
    }

    .timer-controls {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-top: 2rem;
    }

    .timer-controls ion-button {
      --border-radius: 14px;
      font-weight: 700;
      min-height: 48px;
    }

    .start-session-button {
      --background: linear-gradient(135deg, #ffcf74, #ffb25f);
      --color: #2a1b00;
      --border-radius: 14px;
      --box-shadow: 0 10px 20px rgba(214, 145, 57, 0.32);
      font-weight: 800;
      letter-spacing: 0.01em;
      margin-top: 0.4rem;
    }

    .session-notes {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(148, 165, 205, 0.24);
      border-radius: 12px;
      text-align: left;
      color: #1f2937;
    }

    .session-notes p {
      margin: 0.5rem 0 0 0;
      white-space: pre-wrap;
      color: #1f2937;
      font-weight: 600;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }

    ion-select,
    ion-textarea {
      --color: #111827;
      font-weight: 600;
    }

    ion-textarea::part(native) {
      line-height: 1.45;
    }

    ion-select::part(placeholder) {
      color: #475569;
      opacity: 1;
    }

    @media (prefers-color-scheme: dark) {
      .setup-card {
        background:
          radial-gradient(circle at 95% 8%, rgba(130, 156, 255, 0.22), transparent 40%),
          linear-gradient(180deg, rgba(22, 32, 59, 0.96), rgba(17, 28, 54, 0.96));
      }

      .timer-card {
        background:
          radial-gradient(circle at 8% 0%, rgba(103, 201, 171, 0.22), transparent 38%),
          radial-gradient(circle at 95% 10%, rgba(128, 153, 247, 0.2), transparent 42%),
          linear-gradient(180deg, rgba(16, 28, 54, 0.96), rgba(14, 25, 49, 0.96));
      }

      .start-session-button {
        --background: linear-gradient(135deg, #f4c45d, #e8a849);
        --color: #201300;
      }

      .practice-container,
      .practice-container ion-card {
        color: #f3f4f6 !important;
        --color: #f3f4f6;
      }

      .practice-container ion-card-title,
      .practice-container ion-label,
      .practice-container ion-label[position='stacked'],
      .practice-container ion-note,
      .timer-display h1,
      .timer-display p,
      .session-notes,
      .session-notes p {
        color: #e5e7eb !important;
      }

      .practice-container ion-item {
        --color: #e5e7eb;
      }

      ion-select,
      ion-textarea {
        --color: #f3f4f6;
      }

      ion-select::part(placeholder) {
        color: #cbd5e1;
      }
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
export class PracticePage implements OnDestroy {
  private router = inject(Router);
  private alertController = inject(AlertController);
  private practiceService = inject(PracticeService);
  private instrumentService = inject(InstrumentService);
  private questService = inject(QuestService);
  private achievementService = inject(AchievementService);
  private weeklyTargetService = inject(WeeklyTargetService);
  private notificationService = inject(NotificationService);
  private metronomeService = inject(MetronomeService);

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

    effect(() => {
      const availableCategories = this.categories();
      if (availableCategories.length === 0) return;

      const techniqueCategory = availableCategories.find(c => c === 'Technique');
      const defaultCategory = techniqueCategory ?? availableCategories[0];

      if (!this.selectedCategory || !availableCategories.includes(this.selectedCategory)) {
        this.selectedCategory = defaultCategory;
      }
    });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
  }

  async startSession() {

    if (!this.selectedCategory) {
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

    this.practiceService.startTimer();
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
    this.weeklyTargetService.onPracticeCompleted(session);
    await this.notificationService.onPracticeCompleted();

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

  ionViewWillLeave(): void {
    this.metronomeService.resetToDefaults();
  }

  ngOnDestroy(): void {
    this.metronomeService.resetToDefaults();
  }
}
