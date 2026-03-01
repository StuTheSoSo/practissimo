// src/app/core/services/instrument.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Instrument, InstrumentConfig } from '../models/instrument.model';
import { CustomCategories } from '../models/custom-categories.model';
import { INSTRUMENT_CONFIG, getAllInstruments } from '../config/instrument.config';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';

/**
 * InstrumentService - Manages current instrument selection
 * Uses signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
  private storage = inject(StorageService);

  // State signals
  private currentInstrumentSignal = signal<Instrument>('guitar');
  private customCategories = signal<CustomCategories>({});

  // Public readonly signals
  readonly currentInstrument = this.currentInstrumentSignal.asReadonly();

  // Computed signals
  readonly currentConfig = computed<InstrumentConfig>(() =>
    INSTRUMENT_CONFIG[this.currentInstrument()]
  );

  readonly currentCategories = computed<string[]>(() => {
    const defaultCategories = this.currentConfig().categories;
    const customCats = this.customCategories()[this.currentInstrument()] || [];
    return [...defaultCategories, ...customCats];
  });

  readonly currentDisplayName = computed<string>(() =>
    this.currentConfig().displayName
  );

  readonly currentIcon = computed<string>(() =>
    this.currentConfig().icon
  );

  readonly supportsTuner = computed<boolean>(() =>
    this.currentConfig().supportsTuner
  );

  readonly supportsChords = computed<boolean>(() =>
    this.currentConfig().supportsChords
  );

  readonly allInstruments = computed<InstrumentConfig[]>(() =>
    getAllInstruments()
  );

  constructor() {
    // Effect to persist instrument changes
    effect(() => {
      const instrument = this.currentInstrument();
      this.persistInstrument(instrument);
    });

    // Effect to persist custom categories
    effect(() => {
      const categories = this.customCategories();
      this.storage.set(STORAGE_KEYS.CUSTOM_CATEGORIES, categories);
    });
  }

  /**
   * Initialize service - load saved instrument
   */
  async initialize(): Promise<void> {
    const progress = await this.storage.get<{ selectedInstrument: Instrument }>(
      STORAGE_KEYS.USER_PROGRESS
    );

    if (progress?.selectedInstrument) {
      this.currentInstrumentSignal.set(progress.selectedInstrument);
    }

    const savedCustomCategories = await this.storage.get<CustomCategories>(
      STORAGE_KEYS.CUSTOM_CATEGORIES
    );

    if (savedCustomCategories) {
      this.customCategories.set(savedCustomCategories);
    }
  }

  /**
   * Set current instrument
   */
  setInstrument(instrument: Instrument): void {
    this.currentInstrumentSignal.set(instrument);
  }

  /**
   * Get configuration for any instrument
   */
  getConfig(instrument: Instrument): InstrumentConfig {
    return INSTRUMENT_CONFIG[instrument];
  }

  /**
   * Validate if a category exists for current instrument
   */
  isValidCategory(category: string): boolean {
    return this.currentCategories().includes(category);
  }

  /**
   * Add custom category for current instrument
   */
  addCustomCategory(category: string): void {
    const trimmed = category.trim();
    if (!trimmed || this.currentCategories().includes(trimmed)) {
      return;
    }

    const instrument = this.currentInstrument();
    this.customCategories.update(cats => ({
      ...cats,
      [instrument]: [...(cats[instrument] || []), trimmed]
    }));
  }

  /**
   * Remove custom category for current instrument
   */
  removeCustomCategory(category: string): void {
    const instrument = this.currentInstrument();
    const customCats = this.customCategories()[instrument] || [];
    
    if (!customCats.includes(category)) {
      return;
    }

    this.customCategories.update(cats => ({
      ...cats,
      [instrument]: customCats.filter(c => c !== category)
    }));
  }

  /**
   * Edit custom category for current instrument
   */
  editCustomCategory(oldCategory: string, newCategory: string): void {
    const trimmed = newCategory.trim();
    if (!trimmed || trimmed === oldCategory) {
      return;
    }

    const instrument = this.currentInstrument();
    const customCats = this.customCategories()[instrument] || [];
    
    if (!customCats.includes(oldCategory) || customCats.includes(trimmed)) {
      return;
    }

    this.customCategories.update(cats => ({
      ...cats,
      [instrument]: customCats.map(c => c === oldCategory ? trimmed : c)
    }));
  }

  /**
   * Get only custom categories for current instrument
   */
  getCustomCategories(): string[] {
    return this.customCategories()[this.currentInstrument()] || [];
  }

  /**
   * Persist instrument selection (called by effect)
   */
  private async persistInstrument(instrument: Instrument): Promise<void> {
    const progress = await this.storage.get<any>(STORAGE_KEYS.USER_PROGRESS);

    if (progress) {
      progress.selectedInstrument = instrument;
      await this.storage.set(STORAGE_KEYS.USER_PROGRESS, progress);
    }
  }
}
