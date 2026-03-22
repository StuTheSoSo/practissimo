import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { RepertoireItem, RepertoireStatus } from '../models/repertoire-item.model';
import { PracticeSession } from '../models/practice-session.model';
import { StorageService } from './storage.service';
import { InstrumentService } from './instrument.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';

@Injectable({
  providedIn: 'root'
})
export class RepertoireService {
  private storage = inject(StorageService);
  private instrumentService = inject(InstrumentService);

  private items = signal<RepertoireItem[]>([]);

  readonly allItems = this.items.asReadonly();

  readonly currentInstrumentItems = computed(() => {
    const currentInstrument = this.instrumentService.currentInstrument();
    return this.items().filter(item => item.instrument === currentInstrument && item.status !== 'Archived');
  });

  readonly learningItems = computed(() =>
    this.currentInstrumentItems().filter(item => item.status === 'Learning')
  );

  readonly polishingItems = computed(() =>
    this.currentInstrumentItems().filter(item => item.status === 'Polishing')
  );

  readonly readyItems = computed(() =>
    this.currentInstrumentItems().filter(item => item.status === 'Ready')
  );

  readonly archivedItems = computed(() => {
    const currentInstrument = this.instrumentService.currentInstrument();
    return this.items().filter(item => item.instrument === currentInstrument && item.status === 'Archived');
  });

  // Get items that haven't been practiced recently (next up candidates)
  readonly nextUpItems = computed(() => {
    const active = this.currentInstrumentItems();
    return active
      .sort((a, b) => {
        const aDate = a.lastPracticed ? new Date(a.lastPracticed).getTime() : 0;
        const bDate = b.lastPracticed ? new Date(b.lastPracticed).getTime() : 0;
        return aDate - bDate; // Oldest first
      })
      .slice(0, 5);
  });

  constructor() {
    effect(() => {
      const itemsData = this.items();
      if (itemsData.length > 0) {
        this.storage.set(STORAGE_KEYS.REPERTOIRE_ITEMS, itemsData);
      }
    });
  }

  async initialize(): Promise<void> {
    const saved = await this.storage.get<RepertoireItem[]>(
      STORAGE_KEYS.REPERTOIRE_ITEMS
    );

    if (saved) {
      this.items.set(saved);
    }
  }

  addItem(
    title: string,
    instrument: string,
    composer?: string,
    notes?: string,
    targetTempo?: number
  ): RepertoireItem {
    const newItem: RepertoireItem = {
      id: this.generateId(),
      title,
      instrument,
      status: 'Learning',
      composer,
      notes,
      targetTempo,
      dateAdded: new Date().toISOString(),
      practiceCount: 0
    };

    this.items.update(items => [...items, newItem]);
    return newItem;
  }

  updateItem(id: string, updates: Partial<RepertoireItem>): void {
    this.items.update(items =>
      items.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  updateStatus(id: string, status: RepertoireStatus): void {
    this.updateItem(id, { status });
  }

  deleteItem(id: string): void {
    this.items.update(items => items.filter(item => item.id !== id));
  }

  archiveItem(id: string): void {
    this.updateStatus(id, 'Archived');
  }

  restoreFromArchive(id: string): void {
    const item = this.items().find(i => i.id === id);
    if (item) {
      this.updateStatus(id, 'Learning');
    }
  }

  /**
   * Update repertoire item after practice session
   * Called when a session is linked to a repertoire item
   */
  updateAfterPractice(itemId: string, sessionDuration: number, sessionTempo?: number): void {
    this.updateItem(itemId, {
      lastPracticed: new Date().toISOString(),
      practiceCount: (this.items().find(i => i.id === itemId)?.practiceCount || 0) + 1,
      currentTempo: sessionTempo ? Math.max(sessionTempo, (this.items().find(i => i.id === itemId)?.currentTempo || 0)) : undefined
    });
  }

  /**
   * Get items by status
   */
  getItemsByStatus(status: RepertoireStatus, instrument?: string): RepertoireItem[] {
    let filtered = this.items().filter(item => item.status === status);
    if (instrument) {
      filtered = filtered.filter(item => item.instrument === instrument);
    }
    return filtered;
  }

  /**
   * Get items that haven't been practiced in X days
   */
  getNeglectedItems(days: number, instrument?: string): RepertoireItem[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    let items = this.items().filter(item => {
      if (item.status === 'Archived') return false;
      if (instrument && item.instrument !== instrument) return false;

      const lastPracticedTime = item.lastPracticed ? new Date(item.lastPracticed).getTime() : 0;
      return lastPracticedTime < cutoff.getTime();
    });

    return items;
  }

  /**
   * Get most recently practiced items
   */
  getRecentItems(days: number, instrument?: string): RepertoireItem[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    let items = this.items().filter(item => {
      if (item.status === 'Archived') return false;
      if (instrument && item.instrument !== instrument) return false;

      const lastPracticedTime = item.lastPracticed ? new Date(item.lastPracticed).getTime() : 0;
      return lastPracticedTime >= cutoff.getTime();
    });

    return items;
  }

  private generateId(): string {
    return `repertoire_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
