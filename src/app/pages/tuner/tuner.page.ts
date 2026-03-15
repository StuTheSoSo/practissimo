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
import { StringInfo } from '../../core/models/tuner.model';

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

        <ion-card class="selection-card">
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
              <div class="setup-indicator" [class.visible]="showSetupIndicator()">
                <ion-spinner name="crescent"></ion-spinner>
                <span>Listening… locking on</span>
              </div>
              <div
                class="note-name"
                [class.in-tune]="isInTune() && isListening()"
                [class.idle]="!isListening()"
              >
                {{ detectedNote() || (isListening() ? '–' : '–') }}
                @if (detectedOctave() > 0 && detectedNote()) {
                  <span class="octave">{{ detectedOctave() }}</span>
                }
              </div>
              <div class="frequency" [class.hidden]="currentFrequency() <= 0">
                {{ currentFrequency() > 0 ? (currentFrequency() | number:'1.2-2') + ' Hz' : '' }}
              </div>
            </div>

            <!-- Cents Meter -->
            <div class="cents-meter" [class.inactive]="!isListening() || !detectedNote()">
              <div class="meter-labels">
                <span>Flat</span>
                <span>Sharp</span>
              </div>
              <div class="meter-track">
                <div class="meter-center"></div>
                <div
                  class="meter-needle"
                  [style.left.%]="needlePosition()"
                  [class.in-tune]="isInTune() && isListening() && !!detectedNote()"
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

            <!-- Status Badge -->
            <div class="status-display">
              @if (isListening() && detectedNote()) {
                <div
                  class="status-badge"
                  [class.in-tune]="tuningStatus() === 'in-tune'"
                  [class.flat]="tuningStatus() === 'flat'"
                  [class.sharp]="tuningStatus() === 'sharp'"
                >
                  @switch (tuningStatus()) {
                    @case ('in-tune') { ✓ IN TUNE }
                    @case ('flat')    { ♭ {{ centsLabel() }} flat }
                    @default          { ♯ {{ centsLabel() }} sharp }
                  }
                </div>
              }
            </div>

            <!-- Signal confidence -->
            <div class="clarity-indicator" [class.hidden]="!(isListening() && clarity() > 0)">
              <small>Signal: {{ (clarity() * 100).toFixed(0) }}%</small>
            </div>

          </ion-card-content>
        </ion-card>

        <!-- Control Buttons -->
        <div class="control-buttons">
          @if (!isListening()) {
            <ion-button
              class="start-button"
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
              class="stop-button"
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
          <ion-card class="string-guide-card">
            <ion-card-header>
              <ion-card-title>String Guide</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                @for (string of currentTuning()!.strings; track string.stringNumber) {
                  <ion-item
                    class="string-item-button"
                    [class.active-string]="isActiveString(string)"
                    button
                    (click)="playReferenceTone(string)"
                  >
                    <ion-label>
                      <h3>String {{ string.stringNumber }}</h3>
                      <p>{{ string.name }}{{ string.octave }} · {{ string.frequency | number:'1.2-2' }} Hz</p>
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
        <ion-card class="instructions-card">
          <ion-card-content>
            <div class="instructions">
              <strong>How to use:</strong>
              <ol>
                <li>Allow microphone access when prompted</li>
                <li>Tap "Start Tuner"</li>
                <li>Play one string at a time, close to the mic</li>
                <li>Tune until the needle is centred and green</li>
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

    .tuner-container ion-card {
      border-radius: 18px;
      border: 1px solid rgba(131, 161, 220, 0.26);
      box-shadow: 0 10px 22px rgba(63, 84, 131, 0.12);
    }

    .selection-card {
      background:
        radial-gradient(circle at 95% 8%, rgba(169, 194, 255, 0.22), transparent 38%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(246, 251, 255, 0.97));
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

    /* ── Tuner display card ─────────────────────────────────────── */
    .tuner-display {
      margin: 2rem 0;
      background:
        radial-gradient(circle at 5% 2%, rgba(186, 247, 229, 0.3), transparent 34%),
        radial-gradient(circle at 95% 10%, rgba(165, 189, 255, 0.24), transparent 40%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 251, 255, 0.98));
    }

    /* ── Note display ───────────────────────────────────────────── */
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
      min-height: 32px;
      /* Hidden by default; becomes visible via .visible */
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease;
    }

    .setup-indicator.visible {
      opacity: 1;
      visibility: visible;
    }

    .setup-indicator ion-spinner {
      width: 16px;
      height: 16px;
    }

    .note-name {
      font-size: 6rem;
      font-weight: bold;
      line-height: 1;
      color: #3a4b66;
      transition: color 0.25s ease;
      /* Prevent layout shift when note appears */
      min-height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .note-name.in-tune {
      color: var(--ion-color-success);
    }

    .note-name.idle {
      opacity: 0.35;
    }

    .octave {
      font-size: 3rem;
      vertical-align: super;
      line-height: 1;
    }

    .frequency {
      font-size: 1.2rem;
      color: #4a5f80;
      margin-top: 0.5rem;
      font-weight: 700;
      min-height: 1.5rem;
    }

    .frequency.hidden {
      visibility: hidden;
    }

    /* ── Cents meter ────────────────────────────────────────────── */
    .cents-meter {
      margin: 2rem 0;
      transition: opacity 0.3s ease;
    }

    .cents-meter.inactive {
      opacity: 0.4;
    }

    .meter-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #4a5f80;
    }

    .meter-track {
      position: relative;
      height: 40px;
      background: linear-gradient(
        to right,
        #f58a8a 0%,
        #ffd28f 25%,
        #89ddb0 45%,
        #89ddb0 55%,
        #ffd28f 75%,
        #f58a8a 100%
      );
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(80, 99, 139, 0.16);
    }

    .meter-center {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 3px;
      background: rgba(24, 36, 63, 0.7);
      transform: translateX(-50%);
    }

    .meter-needle {
      position: absolute;
      top: 50%;
      width: 4px;
      height: 50px;
      background: #1e2d4b;
      transform: translate(-50%, -50%);
      /* Slightly longer transition than the UI update interval for a smooth feel */
      transition: left 0.08s ease-out, background 0.25s ease, box-shadow 0.25s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border-radius: 2px;
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
      border-top: 12px solid #1e2d4b;
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
      color: #4a5f80;
      font-weight: 700;
    }

    .meter-ticks .center {
      font-weight: bold;
      color: var(--ion-color-success);
    }

    /* ── Status badge ───────────────────────────────────────────── */
    .status-display {
      text-align: center;
      margin: 1.5rem 0;
      min-height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-badge {
      display: inline-block;
      padding: 0.75rem 2rem;
      border-radius: 25px;
      font-size: 1.1rem;
      font-weight: bold;
      transition: background 0.25s ease, box-shadow 0.25s ease;
      border: 1px solid rgba(255, 255, 255, 0.35);
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

    /* ── Clarity indicator ──────────────────────────────────────── */
    .clarity-indicator {
      text-align: center;
      color: var(--ion-color-medium);
      font-size: 0.85rem;
      margin-top: 0.5rem;
      min-height: 1.2rem;
    }

    .clarity-indicator.hidden {
      visibility: hidden;
    }

    /* ── Control buttons ────────────────────────────────────────── */
    .control-buttons {
      margin: 2rem 0;
    }

    .control-buttons ion-button {
      --border-radius: 14px;
      min-height: 50px;
      font-weight: 800;
      letter-spacing: 0.01em;
    }

    .start-button {
      --background: linear-gradient(135deg, #67c9ab, #44b68d);
      --box-shadow: 0 10px 18px rgba(68, 182, 141, 0.35);
    }

    .stop-button {
      --background: linear-gradient(135deg, #f08d8d, #dd6666);
      --box-shadow: 0 10px 18px rgba(221, 102, 102, 0.35);
    }

    /* ── String guide ───────────────────────────────────────────── */
    .active-string {
      background: rgba(98, 154, 255, 0.14);
      border-radius: 12px;
    }

    .string-guide-card ion-item {
      --padding-top: 0.45rem;
      --padding-bottom: 0.45rem;
      --inner-padding-end: 0.25rem;
      border-radius: 12px;
      margin-bottom: 0.35rem;
    }

    .string-item-button {
      --background: rgba(255, 255, 255, 0.72);
      --inner-border-width: 0;
      border: 1px solid rgba(128, 152, 203, 0.34);
      box-shadow: 0 6px 12px rgba(76, 101, 153, 0.12);
      transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }

    .string-item-button:active {
      transform: translateY(1px);
      box-shadow: 0 3px 8px rgba(76, 101, 153, 0.16);
    }

    .string-item-button:hover {
      --background: rgba(255, 255, 255, 0.92);
    }

    .string-guide-card ion-label h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 800;
      color: #1e2f4b;
    }

    .string-guide-card ion-label p {
      margin: 0.2rem 0 0;
      font-size: 0.9rem;
      color: #425777;
      font-weight: 600;
    }

    .string-guide-card ion-badge {
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .string-guide-card ion-icon[name='volume-high'] {
      color: #5f78a2;
    }

    .string-guide-card {
      background:
        radial-gradient(circle at 95% 12%, rgba(190, 205, 255, 0.2), transparent 38%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(246, 250, 255, 0.97));
    }

    /* ── Instructions ───────────────────────────────────────────── */
    .instructions-card {
      background:
        radial-gradient(circle at 6% 12%, rgba(255, 215, 163, 0.22), transparent 38%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(255, 248, 238, 0.97));
    }

    .instructions {
      color: #3b4d6c;
    }

    .instructions strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #1f2e4a;
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

    /* ── Dark mode ──────────────────────────────────────────────── */
    @media (prefers-color-scheme: dark) {
      .selection-card,
      .string-guide-card {
        background:
          radial-gradient(circle at 95% 10%, rgba(140, 165, 255, 0.2), transparent 40%),
          linear-gradient(180deg, rgba(22, 33, 60, 0.96), rgba(17, 28, 54, 0.96));
      }

      .tuner-display {
        background:
          radial-gradient(circle at 5% 2%, rgba(106, 201, 173, 0.2), transparent 36%),
          radial-gradient(circle at 95% 10%, rgba(129, 155, 248, 0.2), transparent 42%),
          linear-gradient(180deg, rgba(16, 29, 55, 0.96), rgba(13, 25, 49, 0.96));
      }

      .instructions-card {
        background:
          radial-gradient(circle at 6% 12%, rgba(228, 178, 114, 0.22), transparent 40%),
          linear-gradient(180deg, rgba(53, 35, 14, 0.95), rgba(41, 28, 12, 0.95));
      }

      .note-name,
      .frequency,
      .meter-labels,
      .meter-ticks,
      .instructions,
      .instructions strong {
        color: #eaf0ff !important;
      }

      .note-name.idle {
        color: #eaf0ff !important;
      }

      .string-guide-card ion-label h3 {
        color: #f4f8ff;
      }

      .string-guide-card ion-label p {
        color: #d8e3ff;
      }

      .string-guide-card ion-icon[name='volume-high'] {
        color: #c9d8ff;
      }

      .string-item-button {
        --background: rgba(28, 40, 70, 0.88);
        border-color: rgba(128, 157, 222, 0.42);
        box-shadow: 0 8px 14px rgba(0, 0, 0, 0.24);
      }

      .string-item-button:hover {
        --background: rgba(36, 49, 82, 0.96);
      }

      .active-string {
        background: rgba(123, 168, 255, 0.22);
      }

      .meter-center {
        background: rgba(235, 243, 255, 0.7);
      }

      .meter-needle {
        background: #f8fafc;
      }

      .meter-needle::before {
        border-top-color: #f8fafc;
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

  // ── Service bindings ───────────────────────────────────────────────────────
  currentInstrument = this.instrumentService.currentDisplayName;
  isListening       = this.tunerService.isListening;
  isInTune          = this.tunerService.isInTune;
  tuningStatus      = this.tunerService.tuningStatus;
  currentTuning     = this.tunerService.currentTuning;
  availableTunings  = this.tunerService.availableTunings;
  closestString     = this.tunerService.closestString;

  // ── State slices ───────────────────────────────────────────────────────────
  private state    = this.tunerService.state;
  detectedNote     = computed(() => this.state().detectedNote);
  detectedOctave   = computed(() => this.state().detectedOctave);
  currentFrequency = computed(() => this.state().currentFrequency);
  cents            = computed(() => this.state().cents);
  clarity          = computed(() => this.state().clarity);

  // ── Derived display values ─────────────────────────────────────────────────

  /**
   * Clamp cents to ±50 before mapping to 0–100% so the needle never leaves
   * the track. The dead-zone rounding in the service already snaps ±3¢ to 0
   * so no extra smoothing is needed here.
   */
  needlePosition = computed(() => {
    const clamped = Math.max(-50, Math.min(50, this.cents()));
    return ((clamped + 50) / 100) * 100;
  });

  /** Human-readable absolute cent value for the status badge. */
  centsLabel = computed(() => Math.abs(this.cents()) + '¢');

  // ── Setup indicator ────────────────────────────────────────────────────────
  private isSettingUp = signal(false);
  private setupTimerId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Show a "locking on" spinner from the moment Start is tapped until the
   * service reports its first detected note (or after a max timeout).
   */
  showSetupIndicator = computed(() =>
    this.isListening() && (this.isSettingUp() || !this.detectedNote())
  );

  constructor() {
    addIcons({ play, stop, musicalNote, volumeHigh, settings });
  }

  // ── Public actions ─────────────────────────────────────────────────────────

  async startTuner(): Promise<void> {
    try {
      this.isSettingUp.set(true);
      await this.tunerService.start();
      this.scheduleSetupIndicatorClear();
    } catch (error) {
      this.isSettingUp.set(false);
      await this.showMicrophoneErrorAlert(error);
    }
  }

  stopTuner(): void {
    this.clearSetupTimer();
    this.isSettingUp.set(false);
    this.tunerService.stop();
  }

  onTuningChange(event: CustomEvent): void {
    this.tunerService.setTuning(event.detail.value as string);
  }

  async playReferenceTone(string: StringInfo): Promise<void> {
    await this.tunerService.playReferenceTone(string, 1000);
  }

  isActiveString(string: StringInfo): boolean {
    return this.closestString()?.stringNumber === string.stringNumber;
  }

  /** Delegates to service so the template has no formatting logic. */
  formatCents(cents: number): string {
    return this.tunerService.formatCents(cents);
  }

  ngOnDestroy(): void {
    this.clearSetupTimer();
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private scheduleSetupIndicatorClear(): void {
    this.clearSetupTimer();
    // Dismiss after 1.4 s regardless — by then the service will have either
    // locked onto a note or the user will see the needle moving.
    this.setupTimerId = setTimeout(() => {
      this.isSettingUp.set(false);
      this.setupTimerId = null;
    }, 1400);
  }

  private clearSetupTimer(): void {
    if (this.setupTimerId !== null) {
      clearTimeout(this.setupTimerId);
      this.setupTimerId = null;
    }
  }

  private async showMicrophoneErrorAlert(error: unknown): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : '';
    const isUnavailable = errorMessage.includes('not available');

    let header  = 'Microphone Access Required';
    let message = 'Please allow microphone access to use the tuner.';

    if (isUnavailable) {
      header  = 'Tuner Unavailable';
      message = 'The tuner is only available for guitar, bass, and violin.';
    } else if (errorMessage.includes('NotAllowedError')) {
      message =
        'Microphone access is blocked. On iOS, delete and reinstall the app, ' +
        'then accept the microphone prompt. You can also check ' +
        'Settings › Privacy & Security › Microphone.';
    } else if (errorMessage.includes('NotFoundError')) {
      message = 'No microphone was found. Please check that your device microphone is available.';
    } else if (errorMessage.includes('SecurityError')) {
      message = 'Microphone access is blocked by security settings. Please check your device restrictions.';
    } else if (errorMessage.includes('getUserMedia')) {
      message = 'Microphone access is not available on this device.';
    } else if (errorMessage.length > 0) {
      message += `\n\nDetails: ${errorMessage}`;
    }

    const canOpenSettings = Capacitor.getPlatform() === 'ios';
    const buttons = isUnavailable
      ? ['OK']
      : [
          ...(canOpenSettings
            ? [{ text: 'Open Settings', handler: () => this.openAppSettings() }]
            : []),
          'OK'
        ];

    const alert = await this.alertController.create({ header, message, buttons });
    await alert.present();
  }

  private openAppSettings(): void {
    if (Capacitor.getPlatform() === 'ios') {
      window.location.assign('app-settings:');
    }
  }
}