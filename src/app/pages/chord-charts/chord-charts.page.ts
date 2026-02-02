// src/app/pages/chord-charts/chord-charts.page.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonChip,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, informationCircle, musicalNotes } from 'ionicons/icons';
import { ChordService } from '../../core/services/chord.service';
import { InstrumentService } from '../../core/services/instrument.service';
import { GuitarChordDiagramComponent } from '../../shared/components/guitar-chord-diagram.component';
import { PianoChordDiagramComponent } from '../../shared/components/piano-chord-diagram.component';
import { Chord, ChordCategory, GuitarChordPosition, PianoChordPosition } from '../../core/models/chord.model';

@Component({
  selector: 'app-chord-charts',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Chord Charts</ion-title>
      </ion-toolbar>

      <!-- Filter Toolbar -->
      <ion-toolbar>
        <ion-segment [value]="selectedView()" (ionChange)="onSegmentChange($event)">
          <ion-segment-button value="all">
            <ion-label>All ({{ chordCount().filtered }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="saved">
            <ion-label>Saved ({{ chordCount().saved }})</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="chord-charts-container">

        <!-- Current Instrument -->
        <div class="instrument-header">
          <ion-icon name="musical-notes" color="primary"></ion-icon>
          <h2>{{ currentInstrument() }}</h2>
        </div>

        <!-- Search -->
        <ion-searchbar
          [value]="searchQuery()"
          (ionInput)="onSearchInput($event)"
          placeholder="Search chords (e.g., 'C major', 'Am')"
          debounce="300"
        ></ion-searchbar>

        <!-- Filter Chips -->
        <div class="filter-chips">
          <ion-chip
            [color]="selectedCategory() === 'all' ? 'primary' : 'medium'"
            (click)="setCategory('all')"
          >
            <ion-label>All</ion-label>
          </ion-chip>

          @for (cat of categories(); track cat) {
            <ion-chip
              [color]="selectedCategory() === cat ? 'primary' : 'medium'"
              (click)="setCategory(cat)"
            >
              <ion-label>{{ categoryLabel(cat) }}</ion-label>
            </ion-chip>
          }
        </div>

        <!-- Difficulty Filter -->
        <div class="difficulty-chips">
          <ion-chip
            [color]="selectedDifficulty() === 'all' ? 'success' : 'medium'"
            (click)="setDifficulty('all')"
            outline
          >
            <ion-label>All Levels</ion-label>
          </ion-chip>
          <ion-chip
            [color]="selectedDifficulty() === 'beginner' ? 'success' : 'medium'"
            (click)="setDifficulty('beginner')"
            outline
          >
            <ion-label>Beginner</ion-label>
          </ion-chip>
          <ion-chip
            [color]="selectedDifficulty() === 'intermediate' ? 'warning' : 'medium'"
            (click)="setDifficulty('intermediate')"
            outline
          >
            <ion-label>Intermediate</ion-label>
          </ion-chip>
          <ion-chip
            [color]="selectedDifficulty() === 'advanced' ? 'danger' : 'medium'"
            (click)="setDifficulty('advanced')"
            outline
          >
            <ion-label>Advanced</ion-label>
          </ion-chip>
        </div>

        <!-- Chord Grid -->
        @if (displayChords().length === 0) {
          <ion-card>
            <ion-card-content>
              <p class="empty-state">
                @if (selectedView() === 'saved') {
                  No saved chords yet. Tap the heart icon on any chord to save it!
                } @else {
                  No chords found. Try different filters or search terms.
                }
              </p>
            </ion-card-content>
          </ion-card>
        }

        <ion-grid class="chord-grid">
          <ion-row>
            @for (chord of displayChords(); track chord.id) {
              <ion-col size="12" size-md="6" size-lg="4">
                <ion-card class="chord-card" (click)="selectChord(chord)">
                  <ion-card-header>
                    <div class="chord-card-header">
                      <ion-card-title>{{ chord.displayName }}</ion-card-title>
                      <ion-button
                        fill="clear"
                        (click)="toggleSaved(chord.id, $event)"
                        class="save-button"
                      >
                        <ion-icon
                          slot="icon-only"
                          [name]="chordService.isChordSaved(chord.id) ? 'heart' : 'heart-outline'"
                          [color]="chordService.isChordSaved(chord.id) ? 'danger' : 'medium'"
                        ></ion-icon>
                      </ion-button>
                    </div>
                    <div class="chord-meta">
                      <ion-badge [color]="difficultyColor(chord.difficulty)">
                        {{ chord.difficulty }}
                      </ion-badge>
                      <span class="chord-category">{{ categoryLabel(chord.category) }}</span>
                    </div>
                  </ion-card-header>

                  <ion-card-content>
                    <!-- Chord Diagram -->
                    @if (isGuitarType(chord)) {
                      <app-guitar-chord-diagram
                        [position]="getGuitarPosition(chord)"
                        [chordName]="chord.displayName"
                        size="medium"
                      ></app-guitar-chord-diagram>
                    }
                    @if (isPianoType(chord)) {
                      <app-piano-chord-diagram
                        [position]="getPianoPosition(chord)"
                        [chordName]="chord.displayName"
                        size="medium"
                      ></app-piano-chord-diagram>
                    }

                    <!-- Description -->
                    @if (chord.description) {
                      <p class="chord-description">{{ chord.description }}</p>
                    }

                    <!-- Common Usage -->
                    @if (chord.commonIn && chord.commonIn.length > 0) {
                      <div class="common-in">
                        <small>Common in:</small>
                        @for (usage of chord.commonIn; track usage) {
                          <ion-chip outline size="small">
                            <ion-label>{{ usage }}</ion-label>
                          </ion-chip>
                        }
                      </div>
                    }
                  </ion-card-content>
                </ion-card>
              </ion-col>
            }
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  `,
  styles: [`
    .chord-charts-container {
      max-width: 1200px;
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

    .filter-chips,
    .difficulty-chips {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }

    .chord-grid {
      padding: 0;
    }

    .chord-card {
      margin: 0;
      height: 100%;
    }

    .chord-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .save-button {
      margin: 0;
      --padding-start: 0;
      --padding-end: 0;
    }

    .chord-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .chord-category {
      font-size: 0.9rem;
      color: var(--ion-color-medium);
    }

    .chord-description {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: var(--ion-color-medium);
    }

    .common-in {
      margin-top: 0.5rem;
    }

    .common-in small {
      display: block;
      margin-bottom: 0.25rem;
      color: var(--ion-color-medium);
    }

    .empty-state {
      text-align: center;
      color: var(--ion-color-medium);
      padding: 2rem;
    }

     .ion-card-content {
      text-align: center;
      overflow-x: auto;
      padding: 1rem 0.5rem;
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
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonChip,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    GuitarChordDiagramComponent,
    PianoChordDiagramComponent
  ]
})
export class ChordChartsPage {
  chordService = inject(ChordService);
  private instrumentService = inject(InstrumentService);

  currentInstrument = this.instrumentService.currentDisplayName;

  selectedView = signal<'all' | 'saved'>('all');
  selectedCategory = signal<ChordCategory | 'all'>('all');
  selectedDifficulty = signal<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  searchQuery = signal<string>('');

  categories = this.chordService.categoriesForInstrument;
  chordCount = this.chordService.chordCount;

  displayChords = signal<Chord[]>([]);

  constructor() {
    addIcons({ heart, heartOutline, informationCircle, musicalNotes });
    this.updateDisplayChords();
  }

  onSegmentChange(event: any) {
    this.selectedView.set(event.detail.value);
    this.updateDisplayChords();
  }

  onViewChange() {
    this.updateDisplayChords();
  }

  onSearchInput(event: any) {
    this.searchQuery.set(event.detail.value || '');
    this.onSearch();
  }

  onSearch() {
    this.chordService.setSearchQuery(this.searchQuery());
    this.updateDisplayChords();
  }

  setCategory(category: ChordCategory | 'all') {
    this.selectedCategory.set(category);
    this.chordService.setCategory(category);
    this.updateDisplayChords();
  }

  setDifficulty(difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced') {
    this.selectedDifficulty.set(difficulty);
    this.chordService.setDifficulty(difficulty);
    this.updateDisplayChords();
  }

  updateDisplayChords() {
    const view = this.selectedView();
    if (view === 'saved') {
      this.displayChords.set(this.chordService.getSavedChords());
    } else {
      this.displayChords.set(this.chordService.filteredChords());
    }
  }

  toggleSaved(chordId: string, event: Event) {
    event.stopPropagation();
    this.chordService.toggleSaved(chordId);
    if (this.selectedView() === 'saved') {
      this.updateDisplayChords();
    }
  }

  selectChord(chord: Chord) {
    // Could navigate to detailed chord view
  }

  categoryLabel(category: string): string {
    const labels: Record<string, string> = {
      major: 'Major',
      minor: 'Minor',
      seventh: '7th',
      extended: 'Extended',
      suspended: 'Sus',
      diminished: 'Dim',
      augmented: 'Aug',
      power: 'Power'
    };
    return labels[category] || category;
  }

  difficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger'
    };
    return colors[difficulty] || 'medium';
  }

  isGuitarType(chord: Chord): boolean {
    return chord.instrument === 'guitar' || chord.instrument === 'bass';
  }

  isPianoType(chord: Chord): boolean {
    return chord.instrument === 'piano';
  }

  getGuitarPosition(chord: Chord): GuitarChordPosition {
    return chord.variations[0].positions as GuitarChordPosition;
  }

  getPianoPosition(chord: Chord): PianoChordPosition {
    return chord.variations[0].positions as PianoChordPosition;
  }
}
