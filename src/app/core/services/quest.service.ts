// src/app/core/services/quest.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Quest } from '../models/quest.model';
import { PracticeSession } from '../models/practice-session.model';
import { Instrument } from '../models/instrument.model';
import { StorageService } from './storage.service';
import { InstrumentService } from './instrument.service';
import { XpService } from './xp.service';
import { GamificationService } from './gamification.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';

/**
 * QuestService - Manages daily quests
 * Generates instrument-specific quests each day
 */
@Injectable({
  providedIn: 'root'
})
export class QuestService {
  private storage = inject(StorageService);
  private instrumentService = inject(InstrumentService);
  private xpService = inject(XpService);
  private gamificationService = inject(GamificationService);

  // State
  private quests = signal<Quest[]>([]);

  // Public readonly signals
  readonly allQuests = this.quests.asReadonly();

  readonly activeQuests = computed(() =>
    this.quests().filter(q => !q.completed && !this.isExpired(q))
  );

  readonly completedQuests = computed(() =>
    this.quests().filter(q => q.completed)
  );

  readonly currentInstrumentQuests = computed(() => {
    const currentInstrument = this.instrumentService.currentInstrument();
    return this.activeQuests().filter(q => q.instrument === currentInstrument);
  });

  constructor() {
    // Effect to persist quests
    effect(() => {
      const questsData = this.quests();
      this.storage.set(STORAGE_KEYS.QUESTS, questsData);
    });
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    const savedQuests = await this.storage.get<Quest[]>(STORAGE_KEYS.QUESTS);

    if (savedQuests) {
      this.quests.set(savedQuests);
    }

    // Generate daily quests if needed
    await this.checkAndGenerateDailyQuests();
  }

  /**
   * Check if new quests need to be generated
   */
  private async checkAndGenerateDailyQuests(): Promise<void> {
    const activeQuests = this.activeQuests();
    const currentInstrument = this.instrumentService.currentInstrument();

    // Check if we have active quests for today
    const hasQuestsForToday = activeQuests.some(q =>
      this.isToday(q.expiresAt) && q.instrument === currentInstrument
    );

    if (!hasQuestsForToday) {
      await this.generateDailyQuests(currentInstrument);
    }
  }

  /**
   * Generate 3 daily quests for current instrument
   */
  async generateDailyQuests(instrument: Instrument): Promise<void> {
    const categories = this.instrumentService.getConfig(instrument).categories;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const newQuests: Quest[] = [
      // Quest 1: Practice specific category
      {
        id: this.generateQuestId(),
        title: `Practice ${categories[0]}`,
        description: `Spend 10 minutes practicing ${categories[0].toLowerCase()}`,
        targetMinutes: 10,
        targetCategory: categories[0],
        progress: 0,
        target: 10,
        completed: false,
        xpReward: this.xpService.calculateQuestXp(10),
        instrument,
        expiresAt: tomorrow.toISOString()
      },
      // Quest 2: Complete multiple sessions
      {
        id: this.generateQuestId(),
        title: 'Practice Twice Today',
        description: 'Complete 2 practice sessions',
        targetSessions: 2,
        progress: 0,
        target: 2,
        completed: false,
        xpReward: this.xpService.calculateQuestXp(20),
        instrument,
        expiresAt: tomorrow.toISOString()
      },
      // Quest 3: Total practice time
      {
        id: this.generateQuestId(),
        title: 'Daily Practice Goal',
        description: 'Practice for 30 minutes total',
        targetMinutes: 30,
        progress: 0,
        target: 30,
        completed: false,
        xpReward: this.xpService.calculateQuestXp(30),
        instrument,
        expiresAt: tomorrow.toISOString()
      }
    ];

    this.quests.update(quests => [...quests, ...newQuests]);
  }

  /**
   * Update quest progress after practice session
   */
  async onPracticeCompleted(session: PracticeSession): Promise<void> {
    const activeQuests = this.currentInstrumentQuests();
    let anyCompleted = false;

    this.quests.update(allQuests => {
      return allQuests.map(quest => {
        if (quest.completed || quest.instrument !== session.instrument) {
          return quest;
        }

        let updated = { ...quest };

        // Update category-specific quests
        if (quest.targetCategory && quest.targetCategory === session.category) {
          updated.progress = Math.min(updated.progress + session.duration, updated.target);
        }

        // Update time-based quests (no category requirement)
        if (quest.targetMinutes && !quest.targetCategory) {
          updated.progress = Math.min(updated.progress + session.duration, updated.target);
        }

        // Update session count quests
        if (quest.targetSessions) {
          updated.progress = Math.min(updated.progress + 1, updated.target);
        }

        // Check completion
        if (updated.progress >= updated.target && !updated.completed) {
          updated.completed = true;
          anyCompleted = true;
          this.gamificationService.awardXp(updated.xpReward);
        }

        return updated;
      });
    });
  }

  /**
   * Check if a date is today
   */
  private isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();

    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  }

  /**
   * Check if quest is expired
   */
  private isExpired(quest: Quest): boolean {
    return new Date(quest.expiresAt) < new Date();
  }

  /**
   * Generate unique quest ID
   */
  private generateQuestId(): string {
    return `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Remove expired quests
   */
  async cleanupExpiredQuests(): Promise<void> {
    this.quests.update(quests =>
      quests.filter(q => !this.isExpired(q) || q.completed)
    );
  }
}
