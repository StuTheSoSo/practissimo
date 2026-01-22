// src/app/core/services/xp.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { LevelInfo } from '../models/level.model';

/**
 * XpService - Manages XP and level calculations
 * Pure calculation service with no persistence
 */
@Injectable({
  providedIn: 'root'
})
export class XpService {
  // Constants
  private readonly BASE_XP_PER_MINUTE = 1;
  private readonly MAX_STREAK_BONUS = 0.5; // 50%
  private readonly STREAK_BONUS_PER_DAY = 0.1; // 10% per day
  private readonly XP_PER_LEVEL = 100;

  /**
   * Calculate XP earned for a practice session
   */
  calculateXpForSession(minutes: number, currentStreak: number): number {
    const baseXp = minutes * this.BASE_XP_PER_MINUTE;
    const streakBonus = this.calculateStreakBonus(currentStreak);
    const totalXp = Math.floor(baseXp * (1 + streakBonus));
    return totalXp;
  }

  /**
   * Calculate streak bonus multiplier
   */
  private calculateStreakBonus(streak: number): number {
    const bonus = (streak - 1) * this.STREAK_BONUS_PER_DAY;
    return Math.min(bonus, this.MAX_STREAK_BONUS);
  }

  /**
   * Calculate level from total XP
   */
  calculateLevel(totalXp: number): number {
    return Math.floor(totalXp / this.XP_PER_LEVEL) + 1;
  }

  /**
   * Calculate XP required for a specific level
   */
  calculateXpForLevel(level: number): number {
    return (level - 1) * this.XP_PER_LEVEL;
  }

  /**
   * Get detailed level information
   */
  getLevelInfo(totalXp: number): LevelInfo {
    const level = this.calculateLevel(totalXp);
    const xpForCurrentLevel = this.calculateXpForLevel(level);
    const xpForNextLevel = this.calculateXpForLevel(level + 1);
    const currentXp = totalXp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = (currentXp / xpNeeded) * 100;

    return {
      level,
      currentXp,
      xpForCurrentLevel,
      xpForNextLevel,
      progressPercent: Math.round(progressPercent)
    };
  }

  /**
   * Calculate quest XP rewards
   */
  calculateQuestXp(targetMinutes: number): number {
    // Quest rewards are 50% bonus of the target practice time
    return Math.floor(targetMinutes * this.BASE_XP_PER_MINUTE * 0.5);
  }

  /**
   * Calculate achievement XP rewards based on type
   */
  calculateAchievementXp(achievementType: string, target: number): number {
    switch (achievementType) {
      case 'streak':
        return target * 10;
      case 'total_practice_time':
        return Math.floor(target / 60) * 50; // 50 XP per hour milestone
      case 'sessions_count':
        return target * 5;
      case 'level':
        return target * 100;
      default:
        return 50;
    }
  }
}
