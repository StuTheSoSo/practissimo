import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../models/storage-keys.model';
import { MILESTONES, Milestone } from '../models/milestone.model';

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {
  private storage = inject(StorageService);
  private celebratedMilestones = signal<string[]>([]);

  async initialize(): Promise<void> {
    const celebrated = await this.storage.get<string[]>(STORAGE_KEYS.CELEBRATED_MILESTONES);
    if (celebrated) {
      this.celebratedMilestones.set(celebrated);
    }
  }

  checkMilestones(stats: {
    totalMinutes: number;
    sessionCount: number;
    currentStreak: number;
    level: number;
  }): Milestone | null {
    const celebrated = this.celebratedMilestones();

    for (const milestone of MILESTONES) {
      if (celebrated.includes(milestone.id)) {
        continue;
      }

      let achieved = false;
      switch (milestone.type) {
        case 'hours':
          achieved = stats.totalMinutes >= milestone.threshold;
          break;
        case 'sessions':
          achieved = stats.sessionCount >= milestone.threshold;
          break;
        case 'streak':
          achieved = stats.currentStreak >= milestone.threshold;
          break;
        case 'level':
          achieved = stats.level >= milestone.threshold;
          break;
      }

      if (achieved) {
        return milestone;
      }
    }

    return null;
  }

  async celebrateMilestone(milestoneId: string): Promise<void> {
    const celebrated = [...this.celebratedMilestones(), milestoneId];
    this.celebratedMilestones.set(celebrated);
    await this.storage.set(STORAGE_KEYS.CELEBRATED_MILESTONES, celebrated);
  }
}
