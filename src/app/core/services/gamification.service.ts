// src/app/core/services/gamification.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { UserProgress } from '../models/user-progress.model';
import { PracticeSession } from '../models/practice-session.model';
import { StorageService } from './storage.service';
import { XpService } from './xp.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';
import { LevelInfo } from '../models/level.model';

/**
 * GamificationService - Manages streaks, XP, levels
 * Core gamification logic
 */
@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private storage = inject(StorageService);
  private xpService = inject(XpService);

  // State
  private progress = signal<UserProgress>({
    selectedInstrument: 'guitar',
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    achievements: [],
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  });

  // Public readonly signals
  readonly userProgress = this.progress.asReadonly();
  readonly totalXp = computed(() => this.progress().totalXp);
  readonly currentStreak = computed(() => this.progress().currentStreak);
  readonly longestStreak = computed(() => this.progress().longestStreak);
  readonly level = computed(() => this.progress().level);
  readonly achievements = computed(() => this.progress().achievements);
  readonly lastActiveDate = computed(() => this.progress().lastActiveDate);

  // Computed level info
  readonly levelInfo = computed<LevelInfo>(() =>
    this.xpService.getLevelInfo(this.totalXp())
  );

  constructor() {
    // Effect to persist progress changes
    effect(() => {
      const progressData = this.progress();
      this.storage.set(STORAGE_KEYS.USER_PROGRESS, progressData);
    });
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    const savedProgress = await this.storage.get<UserProgress>(
      STORAGE_KEYS.USER_PROGRESS
    );

    if (savedProgress) {
      // Check if streak needs to be reset
      const updatedProgress = this.checkAndUpdateStreak(savedProgress);
      this.progress.set(updatedProgress);
    }
  }

  /**
   * Create initial user progress
   */
  async createInitialProgress(instrument: string): Promise<void> {
    const initialProgress: UserProgress = {
      selectedInstrument: instrument as any,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      level: 1,
      achievements: [],
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.progress.set(initialProgress);
    await this.storage.set(STORAGE_KEYS.USER_PROGRESS, initialProgress);
  }

  /**
   * Handle practice session completion
   */
  async onPracticeCompleted(session: PracticeSession): Promise<void> {
    const currentProgress = this.progress();

    // Add XP
    const newTotalXp = currentProgress.totalXp + session.xpEarned;

    // Update streak
    const { currentStreak, longestStreak } = this.updateStreak(
      currentProgress.currentStreak,
      currentProgress.longestStreak,
      currentProgress.lastActiveDate
    );

    // Calculate new level
    const newLevel = this.xpService.calculateLevel(newTotalXp);

    // Update progress
    this.progress.update(p => ({
      ...p,
      totalXp: newTotalXp,
      currentStreak,
      longestStreak,
      level: newLevel,
      lastActiveDate: new Date().toISOString()
    }));
  }

  /**
   * Update streak based on last active date
   */
  private updateStreak(
    currentStreak: number,
    longestStreak: number,
    lastActiveDate: string
  ): { currentStreak: number; longestStreak: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    let newCurrentStreak: number;
    let newLongestStreak: number;

    if (daysDiff === 0) {
      // Same day - maintain streak
      newCurrentStreak = currentStreak;
    } else if (daysDiff === 1) {
      // Next day - increment streak
      newCurrentStreak = currentStreak + 1;
    } else {
      // More than 1 day - reset streak
      newCurrentStreak = 1;
    }

    newLongestStreak = Math.max(longestStreak, newCurrentStreak);

    return { currentStreak: newCurrentStreak, longestStreak: newLongestStreak };
  }

  /**
   * Check and update streak on app initialization
   */
  private checkAndUpdateStreak(progress: UserProgress): UserProgress {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(progress.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    // If more than 1 day has passed without practice, reset streak
    if (daysDiff > 1) {
      return {
        ...progress,
        currentStreak: 0
      };
    }

    return progress;
  }

  /**
   * Award XP directly (for quests, achievements)
   */
  awardXp(amount: number): void {
    this.progress.update(p => {
      const newTotalXp = p.totalXp + amount;
      const newLevel = this.xpService.calculateLevel(newTotalXp);

      return {
        ...p,
        totalXp: newTotalXp,
        level: newLevel
      };
    });
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievementId: string): void {
    this.progress.update(p => ({
      ...p,
      achievements: [...p.achievements, achievementId]
    }));
  }

  /**
   * Check if achievement is unlocked
   */
  isAchievementUnlocked(achievementId: string): boolean {
    return this.achievements().includes(achievementId);
  }

  /**
   * Get streak status for today
   */
  getStreakStatus(): 'active' | 'at_risk' | 'broken' {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(this.lastActiveDate());
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return 'active';
    if (daysDiff === 1) return 'at_risk';
    return 'broken';
  }
}
