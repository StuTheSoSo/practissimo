// src/app/shared/components/metronome.component.ts
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonRange,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { play, pause, add, remove, musicalNote } from 'ionicons/icons';
import { MetronomeService } from '../../core/services/metronome.service';

@Component({
  selector: 'app-metronome',
  template: `
    <ion-card class="metronome-card">
      <ion-card-header>
        <div class="metronome-header">
          <ion-icon name="musical-note" color="primary"></ion-icon>
          <ion-card-title>Metronome</ion-card-title>
          <ion-toggle
            [(ngModel)]="isExpanded"
            class="expand-toggle"
          ></ion-toggle>
        </div>
      </ion-card-header>

      @if (isExpanded) {
        <ion-card-content>
          <!-- BPM Display -->
          <div class="bpm-display">
            <ion-button fill="clear" (click)="decreaseBpm()" size="large">
              <ion-icon slot="icon-only" name="remove"></ion-icon>
            </ion-button>

            <div class="bpm-value" (click)="tapTempo()">
              <div class="bpm-number">{{ metronome.bpm() }}</div>
              <div class="bpm-label">BPM</div>
              <div class="tap-hint">Tap to set</div>
            </div>

            <ion-button fill="clear" (click)="increaseBpm()" size="large">
              <ion-icon slot="icon-only" name="add"></ion-icon>
            </ion-button>
          </div>

          <!-- BPM Slider -->
          <ion-item lines="none" class="slider-item">
            <ion-range
              min="30"
              max="300"
              step="1"
              [value]="metronome.bpm()"
              (ionChange)="onBpmChange($event)"
              color="primary"
              [pin]="true"
            ></ion-range>
          </ion-item>

          <!-- Time Signature -->
          <ion-item>
            <ion-label>Time Signature</ion-label>
            <ion-select
              [value]="metronome.beatsPerBar()"
              (ionChange)="onTimeSignatureChange($event)"
              interface="popover"
            >
              @for (sig of metronome.timeSignatures; track sig.label) {
                <ion-select-option [value]="sig.beats">
                  {{ sig.label }}
                </ion-select-option>
              }
            </ion-select>
          </ion-item>

          <!-- Volume -->
          <ion-item lines="none">
            <ion-label>Volume</ion-label>
            <ion-range
              min="0"
              max="2"
              step="0.1"
              [value]="metronome.volume()"
              (ionChange)="onVolumeChange($event)"
              color="secondary"
            ></ion-range>
          </ion-item>

          <!-- Play/Pause Button -->
          <div class="control-buttons">
            <ion-button
              expand="block"
              [color]="metronome.isPlaying() ? 'danger' : 'success'"
              (click)="toggleMetronome()"
              size="large"
            >
              <ion-icon
                [name]="metronome.isPlaying() ? 'pause' : 'play'"
                slot="start"
              ></ion-icon>
              {{ metronome.isPlaying() ? 'Stop' : 'Start' }}
            </ion-button>
          </div>

          <!-- Visual Beat Indicator -->
          @if (metronome.isPlaying()) {
            <div class="beat-indicator">
              <div class="beat-dots">
                @for (beat of beats; track beat; let i = $index) {
                  <div
                    class="beat-dot"
                    [class.active]="i === currentBeat"
                    [class.accent]="i === 0"
                  ></div>
                }
              </div>
            </div>
          }

          <!-- Preset BPM Buttons -->
          <div class="preset-bpms">
            <ion-button fill="outline" size="small" (click)="setBpm(60)">60</ion-button>
            <ion-button fill="outline" size="small" (click)="setBpm(80)">80</ion-button>
            <ion-button fill="outline" size="small" (click)="setBpm(100)">100</ion-button>
            <ion-button fill="outline" size="small" (click)="setBpm(120)">120</ion-button>
            <ion-button fill="outline" size="small" (click)="setBpm(140)">140</ion-button>
          </div>
        </ion-card-content>
      }
    </ion-card>
  `,
  styles: [`
    .metronome-card {
      margin: 0;
    }

    .metronome-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .metronome-header ion-icon {
      font-size: 1.5rem;
    }

    .metronome-header ion-card-title {
      flex: 1;
    }

    .expand-toggle {
      margin: 0;
    }

    .bpm-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin: 1rem 0;
    }

    .bpm-value {
      text-align: center;
      cursor: pointer;
      user-select: none;
      padding: 1rem;
      border-radius: 12px;
      transition: background 0.2s;
    }

    .bpm-value:active {
      background: var(--ion-color-light);
    }

    .bpm-number {
      font-size: 3rem;
      font-weight: bold;
      line-height: 1;
      color: var(--ion-color-primary);
    }

    .bpm-label {
      font-size: 0.9rem;
      color: var(--ion-color-medium);
      margin-top: 0.25rem;
    }

    .tap-hint {
      font-size: 0.75rem;
      color: var(--ion-color-medium);
      margin-top: 0.25rem;
      font-style: italic;
    }

    .slider-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }

    .control-buttons {
      margin-top: 1rem;
    }

    .beat-indicator {
      margin-top: 1.5rem;
      padding: 1rem;
      background: var(--ion-color-light);
      border-radius: 8px;
    }

    .beat-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .beat-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--ion-color-medium);
      transition: all 0.1s ease;
    }

    .beat-dot.active {
      transform: scale(1.5);
      background: var(--ion-color-primary);
      box-shadow: 0 0 10px var(--ion-color-primary);
    }

    .beat-dot.accent {
      border: 2px solid var(--ion-color-primary);
    }

    .preset-bpms {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .preset-bpms ion-button {
      --padding-start: 0.75rem;
      --padding-end: 0.75rem;
      min-width: 50px;
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonRange,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonToggle
  ]
})
export class MetronomeComponent implements OnDestroy {
  metronome = inject(MetronomeService);

  isExpanded = false;
  currentBeat = 0;
  private beatInterval: any = null;

  beats: number[] = [];

  constructor() {
    addIcons({ play, pause, add, remove, musicalNote });
    this.updateBeats();
  }

  ngOnDestroy(): void {
    this.stopBeatAnimation();
  }

  toggleMetronome(): void {
    this.metronome.toggle();

    if (this.metronome.isPlaying()) {
      this.startBeatAnimation();
    } else {
      this.stopBeatAnimation();
    }
  }

  increaseBpm(): void {
    this.metronome.increaseBpm(5);
  }

  decreaseBpm(): void {
    this.metronome.decreaseBpm(5);
  }

  setBpm(bpm: number): void {
    this.metronome.setBpm(bpm);
  }

  onBpmChange(event: any): void {
    this.metronome.setBpm(event.detail.value);
  }

  onTimeSignatureChange(event: any): void {
    this.metronome.setBeatsPerBar(event.detail.value);
    this.updateBeats();
  }

  onVolumeChange(event: any): void {
    this.metronome.setVolume(event.detail.value);
  }

  tapTempo(): void {
    this.metronome.tapTempo();
  }

  private updateBeats(): void {
    this.beats = Array(this.metronome.beatsPerBar()).fill(0);
  }

  private startBeatAnimation(): void {
    this.currentBeat = 0;
    const beatDuration = (60 / this.metronome.bpm()) * 1000;

    this.beatInterval = setInterval(() => {
      this.currentBeat = (this.currentBeat + 1) % this.metronome.beatsPerBar();
    }, beatDuration);
  }

  private stopBeatAnimation(): void {
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
    this.currentBeat = 0;
  }
}
