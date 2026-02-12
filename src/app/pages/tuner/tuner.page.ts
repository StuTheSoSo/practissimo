// src/app/pages/tuner/tuner.page.ts
import { Component, inject, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
  IonBadge,
  IonList,
  AlertController,
  IonSpinner
} from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { addIcons } from 'ionicons';
import { play, stop, musicalNote, volumeHigh, settings } from 'ionicons/icons';
import { TunerService } from '../../core/services/tuner.service';
import { InstrumentService } from '../../core/services/instrument.service';

@Component({
  selector: 'app-tuner',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Tuner</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="tuner-container">

        <!-- Instrument & Tuning Selection -->
        <div class="instrument-header">
          <ion-icon name="musical-note" color="primary"></ion-icon>
          <h2>{{ currentInstrument() }}</h2>
        </div>

        <ion-card>
          <ion-card-content>
            <ion-item lines="none">
              <ion-label position="stacked">Tuning</ion-label>
              <ion-select
                [value]="currentTuning()?.id"
                (ionChange)="onTuningChange($event)"
                interface="action-sheet"
                [disabled]="isListening()"
              >
                @for (tuning of availableTunings(); track tuning.id) {
                  <ion-select-option [value]="tuning.id">
                    {{ tuning.name }}
                  </ion-select-option>
                }
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Main Tuner Display -->
        <ion-card class="tuner-display">
          <ion-card-content>
            <!-- Detected Note -->
            <div class="note-display">
              @if (showSetupIndicator()) {
                <div class="setup-indicator">
                  <ion-spinner name="crescent"></ion-spinner>
                  <span>Listening... lock-on in progress</span>
                </div>
              }
              <div class="note-name" [class.in-tune]="isInTune()">
                {{ detectedNote() || '-' }}
                @if (detectedOctave() > 0) {
                  <span class="octave">{{ detectedOctave() }}</span>
                }
              </div>
              @if (currentFrequency() > 0) {
                <div class="frequency">{{ currentFrequency().toFixed(2) }} Hz</div>
              }
            </div>

            <!-- Cents Meter -->
            <div class="cents-meter">
              <div class="meter-labels">
                <span>Flat</span>
                <span>Sharp</span>
              </div>
              <div class="meter-track">
                <div class="meter-center"></div>
                <div
                  class="meter-needle"
                  [style.left.%]="needlePosition()"
                  [class.in-tune]="isInTune()"
                ></div>
              </div>
              <div class="meter-ticks">
                <span>-50</span>
                <span>-25</span>
                <span class="center">0</span>
                <span>+25</span>
                <span>+50</span>
              </div>
            </div>

            <!-- Status Display -->
            <div class="status-display">
              @if (cents() !== 0) {
                <div
                  class="status-badge"
                  [class.in-tune]="tuningStatus() === 'in-tune'"
                  [class.flat]="tuningStatus() === 'flat'"
                  [class.sharp]="tuningStatus() === 'sharp'"
                >
                  @if (tuningStatus() === 'in-tune') {
                    ✓ IN TUNE
                  } @else if (tuningStatus() === 'flat') {
                    ♭ {{ formatCents(cents()) }} cents
                  } @else {
                    ♯ {{ formatCents(cents()) }} cents
                  }
                </div>
              }
            </div>

            <!-- Clarity/Confidence Indicator -->
            @if (isListening() && clarity() > 0) {
              <div class="clarity-indicator">
                <small>Signal: {{ (clarity() * 100).toFixed(0) }}%</small>
              </div>
            }
          </ion-card-content>
        </ion-card>

        <!-- Control Buttons -->
        <div class="control-buttons">
          @if (!isListening()) {
            <ion-button
              expand="block"
              size="large"
              color="success"
              (click)="startTuner()"
            >
              <ion-icon name="play" slot="start"></ion-icon>
              Start Tuner
            </ion-button>
          } @else {
            <ion-button
              expand="block"
              size="large"
              color="danger"
              (click)="stopTuner()"
            >
              <ion-icon name="stop" slot="start"></ion-icon>
              Stop Tuner
            </ion-button>
          }
        </div>

        <!-- String Guide -->
        @if (currentTuning()) {
          <ion-card>
            <ion-card-header>
              <ion-card-title>String Guide</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                @for (string of currentTuning()!.strings; track string.stringNumber) {
                  <ion-item
                    [class.active-string]="isActiveString(string)"
                    button
                    (click)="playReferenceTone(string)"
                  >
                    <ion-label>
                      <h3>String {{ string.stringNumber }}</h3>
                      <p>{{ string.name }}{{ string.octave }} - {{ string.frequency.toFixed(2) }} Hz</p>
                    </ion-label>
                    @if (isActiveString(string)) {
                      <ion-badge slot="end" color="primary">Tuning</ion-badge>
                    }
                    <ion-icon name="volume-high" slot="end" color="medium"></ion-icon>
                  </ion-item>
                }
              </ion-list>
            </ion-card-content>
          </ion-card>
        }

        <!-- Instructions -->
        <ion-card>
          <ion-card-content>
            <div class="instructions">
              <strong>How to use:</strong>
              <ol>
                <li>Allow microphone access when prompted</li>
                <li>Click "Start Tuner"</li>
                <li>Play one string at a time</li>
                <li>Tune until the needle is in the center (green)</li>
                <li>Tap any string in the guide to hear its reference tone</li>
              </ol>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .tuner-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .instrument-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .instrument-header ion-icon {
      font-size: 2rem;
    }

    .instrument-header h2 {
      margin: 0;
    }

    .tuner-display {
      margin: 2rem 0;
    }

    .note-display {
      text-align: center;
      margin: 2rem 0;
    }

    .setup-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.8rem;
      margin-bottom: 0.9rem;
      border-radius: 999px;
      background: rgba(56, 128, 255, 0.1);
      color: var(--ion-color-primary);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .setup-indicator ion-spinner {
      width: 16px;
      height: 16px;
    }

    .note-name {
      font-size: 6rem;
      font-weight: bold;
      line-height: 1;
      color: var(--ion-color-medium);
      transition: color 0.3s ease;
    }

    .note-name.in-tune {
      color: var(--ion-color-success);
    }

    .octave {
      font-size: 3rem;
      vertical-align: super;
    }

    .frequency {
      font-size: 1.2rem;
      color: var(--ion-color-medium);
      margin-top: 0.5rem;
    }

    .cents-meter {
      margin: 2rem 0;
    }

    .meter-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: var(--ion-color-medium);
    }

    .meter-track {
      position: relative;
      height: 40px;
      background: linear-gradient(
        to right,
        #ff4444 0%,
        #ffaa44 25%,
        #44ff44 45%,
        #44ff44 55%,
        #ffaa44 75%,
        #ff4444 100%
      );
      border-radius: 20px;
      overflow: hidden;
    }

    .meter-center {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #333;
      transform: translateX(-50%);
    }

    .meter-needle {
      position: absolute;
      top: 50%;
      width: 4px;
      height: 50px;
      background: #000;
      transform: translate(-50%, -50%);
      transition: left 0.1s ease-out;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .meter-needle::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 12px solid #000;
    }

    .meter-needle.in-tune {
      background: var(--ion-color-success);
      box-shadow: 0 2px 12px var(--ion-color-success);
    }

    .meter-needle.in-tune::before {
      border-top-color: var(--ion-color-success);
    }

    .meter-ticks {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: var(--ion-color-medium);
    }

    .meter-ticks .center {
      font-weight: bold;
      color: var(--ion-color-success);
    }

    .status-display {
      text-align: center;
      margin: 2rem 0;
      min-height: 40px;
    }

    .status-badge {
      display: inline-block;
      padding: 0.75rem 2rem;
      border-radius: 25px;
      font-size: 1.2rem;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .status-badge.in-tune {
      background: var(--ion-color-success);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 220, 96, 0.4);
    }

    .status-badge.flat {
      background: var(--ion-color-warning);
      color: white;
    }

    .status-badge.sharp {
      background: var(--ion-color-danger);
      color: white;
    }

    .clarity-indicator {
      text-align: center;
      color: var(--ion-color-medium);
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .control-buttons {
      margin: 2rem 0;
    }

    .active-string {
      background: var(--ion-color-primary-tint);
    }

    .instructions {
      color: var(--ion-color-medium);
    }

    .instructions strong {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--ion-color-dark);
    }

    .instructions ol {
      margin: 0;
      padding-left: 1.5rem;
    }

    .instructions li {
      margin: 0.5rem 0;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
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
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonItem,
    IonBadge,
    IonList,
    IonSpinner
  ]
})
export class TunerPage implements OnDestroy {
  private tunerService = inject(TunerService);
  private instrumentService = inject(InstrumentService);
  private alertController = inject(AlertController);

  currentInstrument = this.instrumentService.currentDisplayName;

  // Tuner state
  state = this.tunerService.state;
  isListening = this.tunerService.isListening;
  isInTune = this.tunerService.isInTune;
  tuningStatus = this.tunerService.tuningStatus;
  currentTuning = this.tunerService.currentTuning;
  availableTunings = this.tunerService.availableTunings;
  closestString = this.tunerService.closestString;

  // Extract individual values
  detectedNote = computed(() => this.state().detectedNote);
  detectedOctave = computed(() => this.state().detectedOctave);
  currentFrequency = computed(() => this.state().currentFrequency);
  cents = computed(() => this.state().cents);
  clarity = computed(() => this.state().clarity);
  private isSettingUp = signal(false);
  showSetupIndicator = computed(() =>
    this.isListening() && (this.isSettingUp() || !this.detectedNote())
  );
  private setupTimerId: number | null = null;

  // Needle position (0-100%)
  needlePosition = computed(() => {
    const cents = this.cents();
    // Map -50 to +50 cents to 0% to 100%
    return ((cents + 50) / 100) * 100;
  });

  constructor() {
    addIcons({ play, stop, musicalNote, volumeHigh, settings });
  }

  async startTuner() {
    try {
      this.isSettingUp.set(true);
      await this.tunerService.start();
      this.scheduleSetupIndicatorClear();
    } catch (error) {
      this.isSettingUp.set(false);
      const errorMessage = error instanceof Error ? error.message : '';
      const isUnavailable = errorMessage.includes('not available');
      let header = 'Microphone Access Required';
      let message =
        'Please allow microphone access to use the tuner.';

      if (isUnavailable) {
        header = 'Tuner Unavailable';
        message = 'Tuner is only available for guitar, bass, and violin.';
      } else if (errorMessage.includes('NotAllowedError')) {
        message =
          'Microphone access is blocked. On iOS, delete and reinstall the app, then accept the microphone prompt. You can also check Settings > Privacy & Security > Microphone.';
      } else if (errorMessage.includes('NotFoundError')) {
        message =
          'No microphone was found. Please check that your device microphone is available.';
      } else if (errorMessage.includes('SecurityError')) {
        message =
          'Microphone access is blocked by security settings. Please check your device restrictions.';
      } else if (errorMessage.includes('getUserMedia')) {
        message =
          'Microphone access is not available on this device.';
      } else if (errorMessage.length > 0) {
        message = `${message}\n\nDetails: ${errorMessage}`;
      }

      const canOpenSettings = Capacitor.getPlatform() === 'ios';
      const buttons = isUnavailable
        ? ['OK']
        : [
            ...(canOpenSettings
              ? [
                  {
                    text: 'Open Settings',
                    handler: () => {
                      this.openSettings();
                    }
                  }
                ]
              : []),
            'OK'
          ];

      const alert = await this.alertController.create({
        header,
        message,
        buttons
      });
      await alert.present();
    }
  }

  stopTuner() {
    this.clearSetupTimer();
    this.isSettingUp.set(false);
    this.tunerService.stop();
  }

  onTuningChange(event: any) {
    this.tunerService.setTuning(event.detail.value);
  }

  playReferenceTone(string: any) {
    this.tunerService.playReferenceTone(string, 1000);
  }

  isActiveString(string: any): boolean {
    const closest = this.closestString();
    if (!closest) return false;
    return closest.stringNumber === string.stringNumber;
  }

  formatCents(cents: number): string {
    return this.tunerService.formatCents(cents);
  }

  private openSettings(): void {
    if (Capacitor.getPlatform() === 'ios') {
      window.location.assign('app-settings:');
    }
  }

  private scheduleSetupIndicatorClear(): void {
    this.clearSetupTimer();
    this.setupTimerId = window.setTimeout(() => {
      this.isSettingUp.set(false);
      this.setupTimerId = null;
    }, 1400);
  }

  private clearSetupTimer(): void {
    if (this.setupTimerId !== null) {
      window.clearTimeout(this.setupTimerId);
      this.setupTimerId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearSetupTimer();
  }
}
