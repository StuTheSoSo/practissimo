// src/app/pages/chord-charts/chord-charts.page.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { heart, heartOutline, informationCircle, musicalNotes, lockClosed } from 'ionicons/icons';
import { ChordService } from '../../core/services/chord.service';
import { InstrumentService } from '../../core/services/instrument.service';
import { GuitarChordDiagramComponent } from '../../shared/components/guitar-chord-diagram.component';
import { PianoChordDiagramComponent } from '../../shared/components/piano-chord-diagram.component';
import { Chord, ChordCategory, GuitarChordPosition, PianoChordPosition } from '../../core/models/chord.model';
import { RevenueCatService } from '../../core/services/revenuecat.service';
import { ModalController } from '@ionic/angular/standalone';
import { PaywallModalComponent } from '../../shared/components/paywall-modal.component';

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
            <ion-label>All ({{ displayCounts().filtered }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="saved">
            <ion-label>
              Saved
              @if (!isPro()) {
                <ion-icon name="lock-closed" class="lock-icon"></ion-icon>
              }
              ({{ displayCounts().saved }})
            </ion-label>
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
            [class.locked]="!isPro()"
          >
            <ion-label>All Levels</ion-label>
          </ion-chip>
          <ion-chip
            [color]="selectedDifficulty() === 'beginner' ? 'success' : 'medium'"
            (click)="setDifficulty('beginner')"
            outline
            [class.locked]="!isPro()"
          >
            <ion-label>Beginner</ion-label>
          </ion-chip>
          <ion-chip
            [color]="selectedDifficulty() === 'intermediate' ? 'warning' : 'medium'"
            (click)="setDifficulty('intermediate')"
            outline
            [class.locked]="!isPro()"
          >
            <ion-label>Intermediate</ion-label>
          </ion-chip>
          <ion-chip
            [color]="selectedDifficulty() === 'advanced' ? 'danger' : 'medium'"
            (click)="setDifficulty('advanced')"
            outline
            [class.locked]="!isPro()"
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
                    @if (isPro() && chord.commonIn && chord.commonIn.length > 0) {
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

        @if (!isPro() && lockedCount() > 0) {
          <ion-card class="pro-cta">
            <ion-card-content>
              <div class="pro-kicker">PracticeQuest Pro</div>
              <h3>Unlock {{ lockedCount() }} more chords</h3>
              <p>Full library access, saved favorites, and advanced filters.</p>
              <p class="pro-price">From $0.99/month or $9.99/year.</p>
              <ul class="pro-features">
                <li>Intermediate + advanced chord charts</li>
                <li>Save chords for quick access</li>
                <li>Complete difficulty filters</li>
                <li>New features at least monthly</li>
              </ul>
              <ion-button expand="block" class="pro-cta-button" (click)="showPaywall('Unlock the full chord library.')">
                Upgrade to Pro
              </ion-button>
            </ion-card-content>
          </ion-card>
        }
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

    .lock-icon {
      margin-left: 0.25rem;
      font-size: 0.9rem;
      vertical-align: middle;
    }

    .difficulty-chips ion-chip.locked {
      opacity: 0.6;
    }

    .pro-cta {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background:
        radial-gradient(800px 220px at -10% -20%, rgba(255, 199, 0, 0.3), transparent 60%),
        radial-gradient(900px 260px at 110% -10%, rgba(0, 209, 255, 0.2), transparent 55%),
        linear-gradient(135deg, #0d1b2a, #152238);
      color: #f8f9ff;
      box-shadow: 0 20px 32px rgba(13, 27, 42, 0.3);
    }

    .pro-cta::after {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 200%;
      height: 100%;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.16) 50%, transparent 70%);
      transform: translateX(-60%);
      animation: pro-shimmer 6s ease-in-out infinite;
      pointer-events: none;
    }

    .pro-kicker {
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .pro-cta h3 {
      margin: 0 0 0.5rem 0;
      color: #ffffff;
    }

    .pro-cta p {
      margin: 0 0 0.75rem 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .pro-cta .pro-price {
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.75rem 0;
    }

    .pro-features {
      margin: 0 0 1rem 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.85);
    }

    .pro-features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pro-features li::before {
      content: '✦';
      color: #ffd166;
      font-size: 0.9rem;
    }

    .pro-cta-button {
      --background: linear-gradient(135deg, #ffd166, #ff8fab);
      --color: #1b1b1b;
      --border-radius: 12px;
      --box-shadow: 0 12px 24px rgba(255, 142, 112, 0.35);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    @keyframes pro-shimmer {
      0% {
        transform: translateX(-60%);
      }
      50% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(60%);
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
  private revenueCat = inject(RevenueCatService);
  private modalController = inject(ModalController);

  currentInstrument = this.instrumentService.currentDisplayName;

  selectedView = signal<'all' | 'saved'>('all');
  selectedCategory = signal<ChordCategory | 'all'>('all');
  selectedDifficulty = signal<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  searchQuery = signal<string>('');

  isPro = this.revenueCat.isPro;

  categories = this.chordService.categoriesForInstrument;

  private readonly freeChordLimit = 20;

  displayChords = computed<Chord[]>(() => {
    const view = this.selectedView();
    if (view === 'saved') {
      return this.isPro() ? this.chordService.getSavedChords() : [];
    }
    return this.getUnlockedChords();
  });

  displayCounts = computed(() => ({
    filtered: this.getUnlockedChords().length,
    saved: this.isPro() ? this.chordService.getSavedChords().length : 0
  }));

  lockedCount = computed(() => {
    const allFiltered = this.chordService.filteredChords().length;
    return Math.max(0, allFiltered - this.getUnlockedChords().length);
  });

  constructor() {
    addIcons({ heart, heartOutline, informationCircle, musicalNotes, lockClosed });

    effect(() => {
      if (!this.isPro() && this.selectedDifficulty() !== 'all') {
        this.selectedDifficulty.set('all');
        this.chordService.setDifficulty('all');
      }
    });
  }

  onSegmentChange(event: any) {
    const nextView = event.detail.value as 'all' | 'saved';
    if (nextView === 'saved' && !this.isPro()) {
      this.showPaywall('Saving chords is a Pro feature.');
      return;
    }
    this.selectedView.set(nextView);
  }

  onViewChange() {
  }

  onSearchInput(event: any) {
    this.searchQuery.set(event.detail.value || '');
    this.onSearch();
  }

  onSearch() {
    this.chordService.setSearchQuery(this.searchQuery());
  }

  setCategory(category: ChordCategory | 'all') {
    this.selectedCategory.set(category);
    this.chordService.setCategory(category);
  }

  setDifficulty(difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced') {
    if (!this.isPro()) {
      this.showPaywall('Difficulty filters are a Pro feature.');
      return;
    }
    this.selectedDifficulty.set(difficulty);
    this.chordService.setDifficulty(difficulty);
  }

  toggleSaved(chordId: string, event: Event) {
    event.stopPropagation();
    if (!this.isPro()) {
      this.showPaywall('Save chords to your favorites with Pro.');
      return;
    }
    this.chordService.toggleSaved(chordId);
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

  private getUnlockedChords(): Chord[] {
    let chords = this.chordService.filteredChords();
    if (!this.isPro()) {
      chords = chords.filter(chord => chord.difficulty === 'beginner').slice(0, this.freeChordLimit);
    }
    return chords;
  }

  async showPaywall(reason?: string) {
    const modal = await this.modalController.create({
      component: PaywallModalComponent,
      componentProps: {
        reason: reason || 'Unlock the full chord library and advanced filters.'
      }
    });
    await modal.present();
  }

}
