import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  CreateGoalInput,
  Goal,
  GoalSuggestionState,
  SuggestedGoalInput
} from '../models/goal.model';
import { STORAGE_KEYS } from '../models/storage-keys.model';
import { StorageService } from './storage.service';
import { PracticeService } from './practice.service';
import { InstrumentService } from './instrument.service';
import { PracticeSession } from '../models/practice-session.model';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private readonly MAX_SUGGESTIONS = 4;
  private readonly COOLDOWN_DAYS = 7;
  private readonly CONSISTENCY_WINDOW_DAYS = 14;

  private storage = inject(StorageService);
  private practiceService = inject(PracticeService);
  private instrumentService = inject(InstrumentService);

  private goalsSignal = signal<Goal[]>([]);
  private suggestionStateSignal = signal<GoalSuggestionState>({
    lastGeneratedDate: null,
    cooldowns: {}
  });

  readonly allGoals = this.goalsSignal.asReadonly();

  readonly activeGoals = computed(() =>
    this.goalsSignal().filter(goal =>
      goal.status === 'active' && !this.isPendingSuggestion(goal)
    )
  );

  readonly completedGoals = computed(() =>
    this.goalsSignal().filter(goal => goal.status === 'completed')
  );

  readonly suggestedGoalsQueue = computed(() => {
    const now = Date.now();
    return this.goalsSignal().filter(goal => {
      if (!this.isPendingSuggestion(goal)) {
        return false;
      }

      if (!goal.snoozedUntil) {
        return true;
      }

      return new Date(goal.snoozedUntil).getTime() <= now;
    });
  });

  readonly overdueGoals = computed(() => {
    const today = this.getLocalDateString(new Date());
    return this.activeGoals().filter(goal => {
      if (!goal.dueDate) {
        return false;
      }

      const goalDate = this.getLocalDateString(new Date(goal.dueDate));
      return goalDate < today;
    });
  });

  readonly suggestionsAvailableCount = computed(() => this.suggestedGoalsQueue().length);

  readonly assistableGoals = computed(() =>
    this.activeGoals().filter(goal => !!goal.metric && (goal.metric.type === 'time' || goal.metric.type === 'reps'))
  );

  constructor() {
    effect(() => {
      void this.storage.set(STORAGE_KEYS.GOALS, this.goalsSignal());
    });

    effect(() => {
      void this.storage.set(STORAGE_KEYS.GOAL_SUGGESTION_STATE, this.suggestionStateSignal());
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void this.refreshSuggestionsIfNeeded();
      }
    });
  }

  async initialize(): Promise<void> {
    const [savedGoals, suggestionState] = await Promise.all([
      this.storage.get<Goal[]>(STORAGE_KEYS.GOALS),
      this.storage.get<GoalSuggestionState>(STORAGE_KEYS.GOAL_SUGGESTION_STATE)
    ]);

    if (savedGoals) {
      this.goalsSignal.set(savedGoals.map(goal => this.normalizeGoal(goal)));
    }

    if (suggestionState) {
      this.suggestionStateSignal.set({
        lastGeneratedDate: suggestionState.lastGeneratedDate || null,
        cooldowns: suggestionState.cooldowns || {}
      });
    }

    await this.refreshSuggestionsIfNeeded();
  }

  createGoal(input: CreateGoalInput): Goal {
    const now = new Date().toISOString();
    const goal: Goal = {
      id: this.generateId('goal'),
      instrument: this.instrumentService.currentInstrument(),
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      category: input.category,
      source: 'user',
      status: 'active',
      priority: input.priority || 'medium',
      dueDate: input.dueDate,
      repeatRule: input.repeatRule,
      metric: input.metric,
      createdAt: now,
      updatedAt: now,
      acceptedAt: now
    };

    this.goalsSignal.update(goals => [goal, ...goals]);
    return goal;
  }

  updateGoal(id: string, patch: Partial<Omit<Goal, 'id' | 'createdAt'>>): void {
    this.goalsSignal.update(goals => goals.map(goal => {
      if (goal.id !== id) {
        return goal;
      }

      return {
        ...goal,
        ...patch,
        updatedAt: new Date().toISOString()
      };
    }));
  }

  completeGoal(id: string): void {
    this.updateGoal(id, { status: 'completed' });
  }

  archiveGoal(id: string): void {
    this.updateGoal(id, { status: 'archived' });
  }

  incrementMetric(id: string, amount: number): void {
    if (!Number.isFinite(amount)) {
      return;
    }

    this.goalsSignal.update(goals => goals.map(goal => {
      if (goal.id !== id || !goal.metric) {
        return goal;
      }

      const nextValue = Math.max(0, goal.metric.currentValue + amount);
      return this.applyMetricUpdate(goal, nextValue);
    }));
  }

  setMetricProgress(id: string, value: number): void {
    if (!Number.isFinite(value)) {
      return;
    }

    this.goalsSignal.update(goals => goals.map(goal => {
      if (goal.id !== id || !goal.metric) {
        return goal;
      }

      return this.applyMetricUpdate(goal, value);
    }));
  }

  acceptSuggestion(id: string): void {
    this.goalsSignal.update(goals => goals.map(goal => {
      if (goal.id !== id || !this.isPendingSuggestion(goal)) {
        return goal;
      }

      return {
        ...goal,
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }));
  }

  dismissSuggestion(id: string): void {
    this.goalsSignal.update(goals => goals.map(goal => {
      if (goal.id !== id || !this.isPendingSuggestion(goal)) {
        return goal;
      }

      return {
        ...goal,
        dismissedAt: new Date().toISOString(),
        status: 'archived',
        updatedAt: new Date().toISOString()
      };
    }));
  }

  snoozeSuggestion(id: string, days: number): void {
    const safeDays = Math.max(1, Math.floor(days));
    const snoozedUntil = new Date();
    snoozedUntil.setDate(snoozedUntil.getDate() + safeDays);

    this.goalsSignal.update(goals => goals.map(goal => {
      if (goal.id !== id || !this.isPendingSuggestion(goal)) {
        return goal;
      }

      return {
        ...goal,
        snoozedUntil: snoozedUntil.toISOString(),
        updatedAt: new Date().toISOString()
      };
    }));
  }

  async refreshSuggestionsIfNeeded(): Promise<void> {
    const today = this.getLocalDateString(new Date());
    const state = this.suggestionStateSignal();

    if (state.lastGeneratedDate === today) {
      return;
    }

    this.generateDailySuggestions();
    this.suggestionStateSignal.update(prev => ({
      ...prev,
      lastGeneratedDate: today
    }));
  }

  logSessionProgress(goalId: string, session: PracticeSession): boolean {
    const goal = this.activeGoals().find(item => item.id === goalId);
    if (!goal?.metric) {
      return false;
    }

    if (goal.metric.type === 'time') {
      this.incrementMetric(goalId, Math.max(0, session.duration));
      return true;
    }

    if (goal.metric.type === 'reps') {
      this.incrementMetric(goalId, 1);
      return true;
    }

    return false;
  }

  logSessionProgressForGoals(goalIds: string[], session: PracticeSession): number {
    return goalIds.reduce((count, goalId) => count + (this.logSessionProgress(goalId, session) ? 1 : 0), 0);
  }

  private generateDailySuggestions(): void {
    const existing = this.suggestedGoalsQueue();
    const remainingSlots = Math.max(0, this.MAX_SUGGESTIONS - existing.length);
    if (remainingSlots === 0) {
      return;
    }

    const candidates = this.buildSuggestionCandidates();
    const nowIso = new Date().toISOString();
    const suggestionsToCreate = candidates.slice(0, remainingSlots);

    if (suggestionsToCreate.length === 0) {
      return;
    }

    const newGoals = suggestionsToCreate.map(input => this.createSuggestedGoal(input, nowIso));
    this.goalsSignal.update(goals => [...newGoals, ...goals]);

    this.suggestionStateSignal.update(state => {
      const nextCooldowns = { ...state.cooldowns };
      for (const item of suggestionsToCreate) {
        nextCooldowns[item.suggestionKey] = nowIso;
      }
      return { ...state, cooldowns: nextCooldowns };
    });
  }

  private buildSuggestionCandidates(): SuggestedGoalInput[] {
    const candidates: SuggestedGoalInput[] = [];
    const instrument = this.instrumentService.currentInstrument();
    const categories = this.instrumentService.currentCategories();

    let largestGap = -1;
    let neglectedCategory: string | null = null;
    for (const category of categories) {
      const gap = this.practiceService.getCategoryGap(category, instrument);
      const gapValue = gap === Infinity ? 999 : gap;
      if (gapValue > largestGap) {
        largestGap = gapValue;
        neglectedCategory = category;
      }
    }

    if (neglectedCategory && largestGap >= 5) {
      const key = `neglected:${instrument}:${neglectedCategory}`;
      if (this.canQueueSuggestion(key)) {
        candidates.push({
          title: `Revisit ${neglectedCategory}`,
          description: `You have not practiced ${neglectedCategory.toLowerCase()} recently. Add focused time this week.`,
          category: neglectedCategory,
          priority: 'high',
          metric: {
            type: 'time',
            targetValue: 45,
            currentValue: 0,
            unit: 'min'
          },
          suggestionReason: 'neglected_category',
          suggestionKey: key
        });
      }
    }

    const recentSessions = this.practiceService.getRecentSessions(this.CONSISTENCY_WINDOW_DAYS, instrument);
    const uniqueDays = new Set(recentSessions.map(session => new Date(session.date).toDateString())).size;
    const consistency = uniqueDays / this.CONSISTENCY_WINDOW_DAYS;

    if (consistency < 0.55) {
      const key = `consistency:${instrument}`;
      if (this.canQueueSuggestion(key)) {
        candidates.push({
          title: 'Consistency Reset Week',
          description: 'Practice in short blocks across more days to rebuild consistency.',
          priority: 'high',
          metric: {
            type: 'time',
            targetValue: 105,
            currentValue: 0,
            unit: 'min'
          },
          suggestionReason: 'consistency_gap',
          suggestionKey: key
        });
      }
    }

    const lastTen = this.practiceService.currentInstrumentSessions().slice(-10);
    const averageMinutes = lastTen.length > 0
      ? lastTen.reduce((sum, session) => sum + session.duration, 0) / lastTen.length
      : 0;

    if (lastTen.length >= 5 && averageMinutes > 0 && averageMinutes < 15) {
      const key = `short-sessions:${instrument}`;
      if (this.canQueueSuggestion(key)) {
        candidates.push({
          title: 'Build Session Depth',
          description: 'Recent sessions are short. Aim for deeper focused work this week.',
          priority: 'medium',
          metric: {
            type: 'time',
            targetValue: 150,
            currentValue: 0,
            unit: 'min'
          },
          suggestionReason: 'short_sessions',
          suggestionKey: key
        });
      }
    }

    return candidates;
  }

  private canQueueSuggestion(key: string): boolean {
    if (this.hasPendingSuggestionWithKey(key)) {
      return false;
    }

    if (this.isInCooldown(key)) {
      return false;
    }

    return true;
  }

  private hasPendingSuggestionWithKey(key: string): boolean {
    return this.goalsSignal().some(goal => this.isPendingSuggestion(goal) && goal.suggestionKey === key);
  }

  private isInCooldown(key: string): boolean {
    const cooldownAt = this.suggestionStateSignal().cooldowns[key];
    if (!cooldownAt) {
      return false;
    }

    const since = Date.now() - new Date(cooldownAt).getTime();
    const cooldownMs = this.COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    return since < cooldownMs;
  }

  private createSuggestedGoal(input: SuggestedGoalInput, nowIso: string): Goal {
    return {
      id: this.generateId('goal_suggested'),
      instrument: this.instrumentService.currentInstrument(),
      title: input.title,
      description: input.description,
      category: input.category,
      source: 'suggested',
      status: 'active',
      priority: input.priority || 'medium',
      dueDate: input.dueDate,
      repeatRule: input.repeatRule,
      metric: input.metric,
      suggestionReason: input.suggestionReason,
      suggestionKey: input.suggestionKey,
      suggestedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso
    };
  }

  private isPendingSuggestion(goal: Goal): boolean {
    return goal.source === 'suggested' && !goal.acceptedAt && !goal.dismissedAt && goal.status === 'active';
  }

  private applyMetricUpdate(goal: Goal, value: number): Goal {
    const target = Math.max(0, goal.metric?.targetValue || 0);
    const nextValue = Math.min(target, Math.max(0, value));
    const nextStatus = target > 0 && nextValue >= target ? 'completed' : goal.status;

    return {
      ...goal,
      status: nextStatus,
      metric: goal.metric
        ? {
            ...goal.metric,
            currentValue: nextValue
          }
        : goal.metric,
      updatedAt: new Date().toISOString()
    };
  }

  private normalizeGoal(goal: Goal): Goal {
    return {
      ...goal,
      priority: goal.priority || 'medium',
      source: goal.source || 'user',
      status: goal.status || 'active',
      createdAt: goal.createdAt || new Date().toISOString(),
      updatedAt: goal.updatedAt || new Date().toISOString()
    };
  }

  private getLocalDateString(date: Date): string {
    const local = new Date(date);
    local.setHours(0, 0, 0, 0);
    const year = local.getFullYear();
    const month = String(local.getMonth() + 1).padStart(2, '0');
    const day = String(local.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}
