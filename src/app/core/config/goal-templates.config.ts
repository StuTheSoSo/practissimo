import { GoalTemplate } from '../models/goal.model';

export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'daily-minutes',
    title: 'Consistent Daily Practice',
    description: 'Build consistency with focused daily minutes.',
    metric: {
      type: 'time',
      defaultTarget: 120,
      unit: 'min'
    }
  },
  {
    id: 'clean-reps',
    title: 'Clean Repetition Set',
    description: 'Accumulate clean repetitions on a target passage.',
    metric: {
      type: 'reps',
      defaultTarget: 20,
      unit: 'reps'
    }
  },
  {
    id: 'tempo-ladder',
    title: 'Tempo Ladder',
    description: 'Increase comfortable tempo for an exercise or piece section.',
    metric: {
      type: 'tempo',
      defaultTarget: 100,
      unit: 'BPM'
    }
  },
  {
    id: 'accuracy-milestone',
    title: 'Accuracy Milestone',
    description: 'Raise execution accuracy over repeated sessions.',
    metric: {
      type: 'accuracy',
      defaultTarget: 90,
      unit: '%'
    }
  }
];
