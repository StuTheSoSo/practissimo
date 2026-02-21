import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { musicalNote, volumeHigh } from 'ionicons/icons';
import {
  HARMONY_INTERVALS,
  HarmonyDirection,
  HarmonyInterval,
  NotePitch,
  PITCH_NOTES,
  PitchNote
} from '../../core/models/pitch-finder.model';
import { PitchFinderService } from '../../core/services/pitch-finder.service';

@Component({
  selector: 'app-pitch-finder',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Pitch Finder</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="pitch-finder-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Root Pitch</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Key</ion-label>
              <ion-select [value]="selectedNote()" (ionChange)="onNoteChange($event)" interface="popover">
                @for (note of notes; track note) {
                  <ion-select-option [value]="note">{{ note }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Octave</ion-label>
              <ion-select [value]="selectedOctave()" (ionChange)="onOctaveChange($event)" interface="popover">
                @for (octave of octaves; track octave) {
                  <ion-select-option [value]="octave">{{ octave }}</ion-select-option>
                }
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Harmony</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Interval</ion-label>
              <ion-select [value]="selectedInterval()" (ionChange)="onIntervalChange($event)" interface="popover">
                @for (interval of intervals; track interval.value) {
                  <ion-select-option [value]="interval.value">{{ interval.label }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item lines="none">
              <ion-label position="stacked">Direction</ion-label>
              <ion-segment [value]="direction()" (ionChange)="onDirectionChange($event)">
                <ion-segment-button value="above">Above</ion-segment-button>
                <ion-segment-button value="below">Below</ion-segment-button>
              </ion-segment>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Preview</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p class="preview-line">
              Root: <strong>{{ rootPitch().note }}{{ rootPitch().octave }}</strong> ({{ rootPitch().frequency.toFixed(2) }} Hz)
            </p>
            <p class="preview-line">
              Harmony: <strong>{{ harmonyPitch().note }}{{ harmonyPitch().octave }}</strong>
              ({{ harmonyPitch().frequency.toFixed(2) }} Hz)
            </p>

            <div class="controls">
              <ion-button expand="block" fill="outline" (click)="playRoot()">
                <ion-icon name="musical-note" slot="start"></ion-icon>
                Play Root
              </ion-button>

              <ion-button expand="block" fill="outline" (click)="playHarmony()">
                <ion-icon name="volume-high" slot="start"></ion-icon>
                Play Harmony
              </ion-button>

              <ion-button expand="block" (click)="playTogether()">
                <ion-icon name="volume-high" slot="start"></ion-icon>
                Play Together
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .pitch-finder-container {
      max-width: 640px;
      margin: 0 auto;
    }

    ion-card {
      border-radius: 16px;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }

    .preview-line {
      margin: 0 0 0.45rem 0;
      color: var(--ion-color-medium-shade);
      font-size: 0.95rem;
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-top: 1rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
  ]
})
export class PitchFinderPage implements OnDestroy {
  private pitchFinderService = inject(PitchFinderService);
  private readonly autoStopMs = 3000;

  notes = PITCH_NOTES;
  octaves = [2, 3, 4, 5];
  intervals = HARMONY_INTERVALS;

  selectedNote = signal<PitchNote>('C');
  selectedOctave = signal<number>(4);
  selectedInterval = signal<HarmonyInterval>('P5');
  direction = signal<HarmonyDirection>('above');

  rootPitch = computed<NotePitch>(() =>
    this.pitchFinderService.getNotePitch(this.selectedNote(), this.selectedOctave())
  );

  harmonyPitch = computed<NotePitch>(() =>
    this.pitchFinderService.getHarmonyPitch(this.rootPitch(), this.selectedInterval(), this.direction())
  );

  constructor() {
    addIcons({ musicalNote, volumeHigh });
  }

  onNoteChange(event: Event): void {
    const nextValue = (event as CustomEvent).detail?.value as PitchNote;
    if (nextValue) this.selectedNote.set(nextValue);
  }

  onOctaveChange(event: Event): void {
    const nextValue = Number((event as CustomEvent).detail?.value);
    if (Number.isFinite(nextValue)) this.selectedOctave.set(nextValue);
  }

  onIntervalChange(event: Event): void {
    const nextValue = (event as CustomEvent).detail?.value as HarmonyInterval;
    if (nextValue) this.selectedInterval.set(nextValue);
  }

  onDirectionChange(event: Event): void {
    const nextValue = (event as CustomEvent).detail?.value as HarmonyDirection;
    if (nextValue === 'above' || nextValue === 'below') {
      this.direction.set(nextValue);
    }
  }

  playRoot(): void {
    this.pitchFinderService.playRoot(this.selectedNote(), this.selectedOctave(), this.autoStopMs);
  }

  playHarmony(): void {
    this.pitchFinderService.playHarmony(
      this.selectedNote(),
      this.selectedOctave(),
      this.selectedInterval(),
      this.direction(),
      this.autoStopMs
    );
  }

  playTogether(): void {
    this.pitchFinderService.playTogether(
      this.selectedNote(),
      this.selectedOctave(),
      this.selectedInterval(),
      this.direction(),
      this.autoStopMs
    );
  }

  ionViewWillLeave(): void {
    this.pitchFinderService.stop();
  }

  ngOnDestroy(): void {
    this.pitchFinderService.stop();
  }
}
