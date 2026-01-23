// src/app/core/services/chord.service.ts
import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Chord, SavedChord, ChordCategory } from '../models/chord.model';
import { CHORD_LIBRARY, getChordsForInstrument, getChordsByCategory, getChordsByDifficulty, searchChords } from '../config/chord-library.config';
import { InstrumentService } from './instrument.service';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'saved_chords';

/**
 * ChordService - Manages chord library and user's saved chords
 */
@Injectable({
  providedIn: 'root'
})
export class ChordService {
  private instrumentService = inject(InstrumentService);
  private storage = inject(StorageService);

  // State
  private savedChordIds = signal<string[]>([]);
  private selectedCategory = signal<ChordCategory | 'all'>('all');
  private selectedDifficulty = signal<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  private searchQuery = signal<string>('');

  // Public readonly signals
  readonly savedChords = this.savedChordIds.asReadonly();

  // Computed signals
  readonly currentInstrumentChords = computed<Chord[]>(() => {
    const instrument = this.instrumentService.currentInstrument();
    return getChordsForInstrument(instrument);
  });

  readonly filteredChords = computed<Chord[]>(() => {
    let chords = this.currentInstrumentChords();
    const category = this.selectedCategory();
    const difficulty = this.selectedDifficulty();
    const query = this.searchQuery().toLowerCase();

    // Filter by category
    if (category !== 'all') {
      chords = chords.filter(c => c.category === category);
    }

    // Filter by difficulty
    if (difficulty !== 'all') {
      chords = chords.filter(c => c.difficulty === difficulty);
    }

    // Filter by search query
    if (query) {
      chords = chords.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.displayName.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      );
    }

    return chords;
  });

  readonly categoriesForInstrument = computed<ChordCategory[]>(() => {
    const chords = this.currentInstrumentChords();
    const categories = new Set<ChordCategory>();
    chords.forEach(chord => categories.add(chord.category));
    return Array.from(categories).sort();
  });

  readonly chordCount = computed(() => ({
    total: this.currentInstrumentChords().length,
    filtered: this.filteredChords().length,
    saved: this.savedChords().length
  }));

  constructor() {
    // Persist saved chords
    effect(() => {
      const saved = this.savedChords();
      this.storage.set(STORAGE_KEY, saved);
    });
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    const saved = await this.storage.get<string[]>(STORAGE_KEY);
    if (saved) {
      this.savedChordIds.set(saved);
    }
  }

  /**
   * Get chord by ID
   */
  getChordById(id: string): Chord | undefined {
    return CHORD_LIBRARY.find(c => c.id === id);
  }

  /**
   * Check if chord is saved
   */
  isChordSaved(chordId: string): boolean {
    return this.savedChords().includes(chordId);
  }

  /**
   * Save/favorite a chord
   */
  saveChord(chordId: string): void {
    if (!this.isChordSaved(chordId)) {
      this.savedChordIds.update(saved => [...saved, chordId]);
    }
  }

  /**
   * Unsave/unfavorite a chord
   */
  unsaveChord(chordId: string): void {
    this.savedChordIds.update(saved => saved.filter(id => id !== chordId));
  }

  /**
   * Toggle saved state
   */
  toggleSaved(chordId: string): void {
    if (this.isChordSaved(chordId)) {
      this.unsaveChord(chordId);
    } else {
      this.saveChord(chordId);
    }
  }

  /**
   * Get all saved chords
   */
  getSavedChords(): Chord[] {
    return this.savedChords()
      .map(id => this.getChordById(id))
      .filter((c): c is Chord => c !== undefined);
  }

  /**
   * Set category filter
   */
  setCategory(category: ChordCategory | 'all'): void {
    this.selectedCategory.set(category);
  }

  /**
   * Set difficulty filter
   */
  setDifficulty(difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced'): void {
    this.selectedDifficulty.set(difficulty);
  }

  /**
   * Set search query
   */
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.selectedCategory.set('all');
    this.selectedDifficulty.set('all');
    this.searchQuery.set('');
  }

  /**
   * Get chords by category (for current instrument)
   */
  getChordsByCategoryForCurrentInstrument(category: ChordCategory): Chord[] {
    const instrument = this.instrumentService.currentInstrument();
    return getChordsByCategory(instrument, category);
  }

  /**
   * Get beginner chords for current instrument
   */
  getBeginnerChords(): Chord[] {
    const instrument = this.instrumentService.currentInstrument();
    return getChordsByDifficulty(instrument, 'beginner');
  }
}
