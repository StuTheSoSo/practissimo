// src/app/pages/onboarding/onboarding.page.ts
import { Component, inject, signal } from '@angular/core';
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
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { musicalNotes, musicalNote, listOutline, disc, musicalNotesOutline } from 'ionicons/icons';
import { Instrument } from '../../core/models/instrument.model';
import { InstrumentService } from '../../core/services/instrument.service';
import { GamificationService } from '../../core/services/gamification.service';
import { StorageService } from '../../core/services/storage.service';
import { STORAGE_KEYS } from '../../core/models/storage-keys.model';

@Component({
  selector: 'app-onboarding',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Welcome to PracticeQuest</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="onboarding-container">
        <h1>Choose Your Instrument</h1>
        <p class="subtitle">Select your primary instrument to get started. You can change this later in settings.</p>

        <ion-grid>
          <ion-row>
            @for (instrument of instruments(); track instrument.id) {
              <ion-col size="6" size-md="4">
                <ion-card
                  [class.selected]="selectedInstrument() === instrument.id"
                  (click)="selectInstrument(instrument.id)"
                  button
                >
                  <ion-card-header>
                    <ion-icon [name]="instrument.icon" size="large"></ion-icon>
                    <ion-card-title>{{ instrument.displayName }}</ion-card-title>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            }
          </ion-row>
        </ion-grid>

        <ion-button
          expand="block"
          [disabled]="!selectedInstrument()"
          (click)="continue()"
          class="continue-button"
        >
          Continue
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .onboarding-container {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
      padding: 1.5rem 0 1rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .subtitle {
      color: var(--ion-color-medium);
      margin-bottom: 2rem;
    }

    ion-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    ion-card.selected {
      border-color: var(--ion-color-primary);
      background: var(--ion-color-primary-tint);
    }

    ion-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      padding: 1rem;
    }

    ion-card-title {
      font-size: 1rem;
    }

    ion-icon {
      color: var(--ion-color-primary);
      font-size: 32px;
    }

    .continue-button {
      margin-top: 1.5rem;
    }

    @media (max-width: 380px), (max-height: 700px) {
      .onboarding-container {
        padding: 1rem 0 0.75rem;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        margin-bottom: 1rem;
      }

      ion-card-header {
        padding: 0.7rem;
      }

      ion-card-title {
        font-size: 0.85rem;
      }

      ion-icon {
        font-size: 24px;
      }

      .continue-button {
        margin-top: 1rem;
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class OnboardingPage {
  private router = inject(Router);
  private instrumentService = inject(InstrumentService);
  private gamificationService = inject(GamificationService);
  private storage = inject(StorageService);

  instruments = this.instrumentService.allInstruments;
  selectedInstrument = signal<Instrument | null>(null);

  constructor() {
    addIcons({ musicalNotes, musicalNote, listOutline, disc, musicalNotesOutline });
    this.checkOnboardingStatus();
  }

  async checkOnboardingStatus() {
    const completed = await this.storage.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
    if (completed) {
      this.router.navigate(['/home']);
    }
  }

  selectInstrument(instrument: Instrument) {
    this.selectedInstrument.set(instrument);
  }

  async continue() {
    const instrument = this.selectedInstrument();
    if (!instrument) return;

    // Set instrument
    this.instrumentService.setInstrument(instrument);

    // Create initial user progress
    await this.gamificationService.createInitialProgress(instrument);

    // Mark onboarding as completed
    await this.storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, true);

    // Navigate to home
    this.router.navigate(['/home']);
  }
}
