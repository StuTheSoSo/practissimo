// src/app/core/services/achievement.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Achievement, AchievementType } from '../models/achievement.model';
import { StorageService } from './storage.service';
import { GamificationService } from './gamification.service';
import { PracticeService } from './practice.service';
import { XpService } from './xp.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';

/**
 * AchievementService - Manages achievements and unlocking
 */
@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private storage = inject(StorageService);
  private gamificationService = inject(GamificationService);
  private practiceService = inject(PracticeService);
  private xpService = inject(XpService);

  // State
  private achievements = signal<Achievement[]>([]);

  // Public readonly signals
  readonly allAchievements = this.achievements.asReadonly();

  readonly unlockedAchievements = computed(() =>
    this.achievements().filter(a => a.unlocked)
  );

  readonly lockedAchievements = computed(() =>
    this.achievements().filter(a => !a.unlocked)
  );

  readonly unlockedCount = computed(() =>
    this.unlockedAchievements().length
  );

  readonly totalCount = computed(() =>
    this.achievements().length
  );

  constructor() {
    // Effect to persist achievements
    effect(() => {
      const achievementsData = this.achievements();
      this.storage.set(STORAGE_KEYS.ACHIEVEMENTS, achievementsData);
    });
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    const savedAchievements = await this.storage.get<Achievement[]>(
      STORAGE_KEYS.ACHIEVEMENTS
    );

    if (savedAchievements) {
      this.achievements.set(savedAchievements);
    } else {
      // Generate initial achievements
      this.achievements.set(this.generateInitialAchievements());
    }
  }

  /**
   * Generate initial achievement list
   */
  private generateInitialAchievements(): Achievement[] {
    return [
      // Streak achievements
      {
        id: 'streak_3',
        title: 'Getting Started',
        description: 'Maintain a 3-day practice streak',
        icon: 'flame',
        xpReward: this.xpService.calculateAchievementXp('streak', 3),
        unlocked: false,
        requirement: { type: 'streak', target: 3 }
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day practice streak',
        icon: 'flame',
        xpReward: this.xpService.calculateAchievementXp('streak', 7),
        unlocked: false,
        requirement: { type: 'streak', target: 7 }
      },
      {
        id: 'streak_30',
        title: 'Monthly Master',
        description: 'Maintain a 30-day practice streak',
        icon: 'flame',
        xpReward: this.xpService.calculateAchievementXp('streak', 30),
        unlocked: false,
        requirement: { type: 'streak', target: 30 }
      },
      {
        id: 'streak_100',
        title: 'Centurion',
        description: 'Maintain a 100-day practice streak',
        icon: 'flame',
        xpReward: this.xpService.calculateAchievementXp('streak', 100),
        unlocked: false,
        requirement: { type: 'streak', target: 100 }
      },
      // Total practice time achievements
      {
        id: 'time_60',
        title: 'First Hour',
        description: 'Practice for 1 hour total',
        icon: 'time',
        xpReward: this.xpService.calculateAchievementXp('total_practice_time', 60),
        unlocked: false,
        requirement: { type: 'total_practice_time', target: 60 }
      },
      {
        id: 'time_600',
        title: 'Ten Hour Club',
        description: 'Practice for 10 hours total',
        icon: 'time',
        xpReward: this.xpService.calculateAchievementXp('total_practice_time', 600),
        unlocked: false,
        requirement: { type: 'total_practice_time', target: 600 }
      },
      {
        id: 'time_3000',
        title: 'Dedication',
        description: 'Practice for 50 hours total',
        icon: 'time',
        xpReward: this.xpService.calculateAchievementXp('total_practice_time', 3000),
        unlocked: false,
        requirement: { type: 'total_practice_time', target: 3000 }
      },
      {
        id: 'time_6000',
        title: 'Century Practice',
        description: 'Practice for 100 hours total',
        icon: 'time',
        xpReward: this.xpService.calculateAchievementXp('total_practice_time', 6000),
        unlocked: false,
        requirement: { type: 'total_practice_time', target: 6000 }
      },
      // Session count achievements
      {
        id: 'sessions_10',
        title: 'Beginner',
        description: 'Complete 10 practice sessions',
        icon: 'musical-notes',
        xpReward: this.xpService.calculateAchievementXp('sessions_count', 10),
        unlocked: false,
        requirement: { type: 'sessions_count', target: 10 }
      },
      {
        id: 'sessions_50',
        title: 'Intermediate',
        description: 'Complete 50 practice sessions',
        icon: 'musical-notes',
        xpReward: this.xpService.calculateAchievementXp('sessions_count', 50),
        unlocked: false,
        requirement: { type: 'sessions_count', target: 50 }
      },
      {
        id: 'sessions_100',
        title: 'Advanced',
        description: 'Complete 100 practice sessions',
        icon: 'musical-notes',
        xpReward: this.xpService.calculateAchievementXp('sessions_count', 100),
        unlocked: false,
        requirement: { type: 'sessions_count', target: 100 }
      },
      // Level achievements
      {
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reach level 5',
        icon: 'star',
        xpReward: this.xpService.calculateAchievementXp('level', 5),
        unlocked: false,
        requirement: { type: 'level', target: 5 }
      },
      {
        id: 'level_10',
        title: 'Skilled Player',
        description: 'Reach level 10',
        icon: 'star',
        xpReward: this.xpService.calculateAchievementXp('level', 10),
        unlocked: false,
        requirement: { type: 'level', target: 10 }
      },
      {
        id: 'level_25',
        title: 'Master Musician',
        description: 'Reach level 25',
        icon: 'star',
        xpReward: this.xpService.calculateAchievementXp('level', 25),
        unlocked: false,
        requirement: { type: 'level', target: 25 }
      }
    ];
  }

  /**
   * Check and unlock achievements
   */
  async checkAchievements(): Promise<Achievement[]> {
    const newlyUnlocked: Achievement[] = [];
    const userProgress = this.gamificationService.userProgress();
    const allSessions = this.practiceService.allSessions();
    const totalPracticeMinutes = this.practiceService.getTotalPracticeTime();

    this.achievements.update(achievements => {
      return achievements.map(achievement => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;

        switch (achievement.requirement.type) {
          case 'streak':
            shouldUnlock = userProgress.currentStreak >= achievement.requirement.target;
            break;

          case 'total_practice_time':
            shouldUnlock = totalPracticeMinutes >= achievement.requirement.target;
            break;

          case 'sessions_count':
            shouldUnlock = allSessions.length >= achievement.requirement.target;
            break;

          case 'level':
            shouldUnlock = userProgress.level >= achievement.requirement.target;
            break;
        }

        if (shouldUnlock) {
          const unlocked = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          newlyUnlocked.push(unlocked);

          // Award XP
          this.gamificationService.awardXp(achievement.xpReward);
          this.gamificationService.unlockAchievement(achievement.id);

          return unlocked;
        }

        return achievement;
      });
    });

    return newlyUnlocked;
  }

  /**
   * Get achievement progress percentage
   */
  getAchievementProgress(achievement: Achievement): number {
    if (achievement.unlocked) return 100;

    const userProgress = this.gamificationService.userProgress();
    const allSessions = this.practiceService.allSessions();
    const totalPracticeMinutes = this.practiceService.getTotalPracticeTime();

    let current = 0;

    switch (achievement.requirement.type) {
      case 'streak':
        current = userProgress.currentStreak;
        break;

      case 'total_practice_time':
        current = totalPracticeMinutes;
        break;

      case 'sessions_count':
        current = allSessions.length;
        break;

      case 'level':
        current = userProgress.level;
        break;
    }

    return Math.min(100, Math.round((current / achievement.requirement.target) * 100));
  }
}
