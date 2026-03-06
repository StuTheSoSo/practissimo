import { Instrument } from './instrument.model';

export type GoalSource = 'user' | 'suggested';
export type GoalStatus = 'active' | 'completed' | 'archived';
export type GoalPriority = 'low' | 'medium' | 'high';
export type GoalMetricType = 'time' | 'reps' | 'tempo' | 'accuracy';

export interface GoalMetric {
  type: GoalMetricType;
  targetValue: number;
  currentValue: number;
  unit: string;
}

export type GoalSuggestionReason =
  | 'neglected_category'
  | 'consistency_gap'
  | 'short_sessions';

export interface Goal {
  id: string;
  instrument: Instrument;
  title: string;
  description?: string;
  category?: string;
  source: GoalSource;
  status: GoalStatus;
  priority: GoalPriority;
  dueDate?: string;
  repeatRule?: string;
  metric?: GoalMetric;
  suggestionReason?: GoalSuggestionReason;
  suggestionKey?: string;
  suggestedAt?: string;
  snoozedUntil?: string;
  dismissedAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalSuggestionState {
  lastGeneratedDate: string | null;
  cooldowns: Record<string, string>;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  category?: string;
  priority?: GoalPriority;
  dueDate?: string;
  repeatRule?: string;
  metric?: GoalMetric;
}

export interface SuggestedGoalInput extends CreateGoalInput {
  suggestionReason: GoalSuggestionReason;
  suggestionKey: string;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  metric: {
    type: GoalMetricType;
    defaultTarget: number;
    unit: string;
  };
}
