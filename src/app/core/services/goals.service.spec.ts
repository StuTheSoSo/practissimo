import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { GoalsService } from './goals.service';
import { StorageService } from './storage.service';
import { PracticeService } from './practice.service';
import { InstrumentService } from './instrument.service';
import { PracticeSession } from '../models/practice-session.model';

class MockStorageService {
  private data = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    return (this.data.get(key) as T) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.data.set(key, value);
  }
}

class MockPracticeService {
  private sessionsSignal = signal<PracticeSession[]>([]);
  currentInstrumentSessions = this.sessionsSignal.asReadonly();

  setSessions(sessions: PracticeSession[]): void {
    this.sessionsSignal.set(sessions);
  }

  getCategoryGap(category: string): number {
    if (category === 'Technique') {
      return 10;
    }
    return 2;
  }

  getRecentSessions(): PracticeSession[] {
    return this.sessionsSignal();
  }
}

class MockInstrumentService {
  private instrumentSignal = signal<'guitar'>('guitar');
  private categoriesSignal = signal(['Technique', 'Songs', 'Scales']);

  currentInstrument = this.instrumentSignal.asReadonly();
  currentCategories = this.categoriesSignal.asReadonly();
}

describe('GoalsService', () => {
  let service: GoalsService;
  let practiceService: MockPracticeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        GoalsService,
        { provide: StorageService, useClass: MockStorageService },
        { provide: PracticeService, useClass: MockPracticeService },
        { provide: InstrumentService, useClass: MockInstrumentService }
      ]
    }).compileComponents();

    service = TestBed.inject(GoalsService);
    practiceService = TestBed.inject(PracticeService) as unknown as MockPracticeService;

    practiceService.setSessions([
      {
        id: 's1',
        instrument: 'guitar',
        date: new Date().toISOString(),
        duration: 8,
        category: 'Songs',
        xpEarned: 10
      }
    ]);

    await service.initialize();
  });

  it('creates and updates goals', () => {
    const goal = service.createGoal({
      title: 'Practice Alternate Picking',
      metric: {
        type: 'reps',
        targetValue: 10,
        currentValue: 0,
        unit: 'reps'
      }
    });

    service.incrementMetric(goal.id, 3);
    expect(service.activeGoals().find(item => item.id === goal.id)?.metric?.currentValue).toBe(3);

    service.setMetricProgress(goal.id, 10);
    expect(service.completedGoals().find(item => item.id === goal.id)).toBeTruthy();
  });

  it('generates suggestions once per day and respects queue selectors', async () => {
    const initialCount = service.suggestedGoalsQueue().length;
    expect(initialCount).toBeGreaterThan(0);

    await service.refreshSuggestionsIfNeeded();
    expect(service.suggestedGoalsQueue().length).toBe(initialCount);
  });

  it('accepts, dismisses, and snoozes suggestions', () => {
    const suggestion = service.suggestedGoalsQueue()[0];
    expect(suggestion).toBeTruthy();

    service.snoozeSuggestion(suggestion.id, 2);
    expect(service.suggestedGoalsQueue().some(item => item.id === suggestion.id)).toBeFalse();

    service.acceptSuggestion(suggestion.id);
    expect(service.activeGoals().some(item => item.id === suggestion.id)).toBeTrue();

    const nextSuggestion = service.suggestedGoalsQueue()[0];
    if (nextSuggestion) {
      service.dismissSuggestion(nextSuggestion.id);
      expect(service.suggestedGoalsQueue().some(item => item.id === nextSuggestion.id)).toBeFalse();
    }
  });

  it('applies assisted session progress to time/reps goals', () => {
    const timeGoal = service.createGoal({
      title: 'Technique Minutes',
      metric: {
        type: 'time',
        targetValue: 30,
        currentValue: 0,
        unit: 'min'
      }
    });

    const repsGoal = service.createGoal({
      title: 'Clean Reps',
      metric: {
        type: 'reps',
        targetValue: 5,
        currentValue: 0,
        unit: 'reps'
      }
    });

    const updated = service.logSessionProgressForGoals([timeGoal.id, repsGoal.id], {
      id: 'session-test',
      instrument: 'guitar',
      date: new Date().toISOString(),
      duration: 12,
      category: 'Technique',
      xpEarned: 20
    });

    expect(updated).toBe(2);
    expect(service.activeGoals().find(goal => goal.id === timeGoal.id)?.metric?.currentValue).toBe(12);
    expect(service.activeGoals().find(goal => goal.id === repsGoal.id)?.metric?.currentValue).toBe(1);
  });
});
