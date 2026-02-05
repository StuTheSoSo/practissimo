// src/app/core/services/instrument.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Instrument, InstrumentConfig } from '../models/instrument.model';
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

  // Public readonly signals
  readonly currentInstrument = this.currentInstrumentSignal.asReadonly();

  // Computed signals
  readonly currentConfig = computed<InstrumentConfig>(() =>
    INSTRUMENT_CONFIG[this.currentInstrument()]
  );

  readonly currentCategories = computed<string[]>(() =>
    this.currentConfig().categories
  );

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
