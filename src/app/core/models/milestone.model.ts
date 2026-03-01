export interface Milestone {
  id: string;
  type: 'hours' | 'sessions' | 'streak' | 'level';
  threshold: number;
  title: string;
  message: string;
  icon: string;
}

export const MILESTONES: Milestone[] = [
  // Hours
  { id: 'hours_10', type: 'hours', threshold: 600, title: '10 Hours Practiced!', message: 'You\'re building a solid foundation!', icon: '🎵' },
  { id: 'hours_25', type: 'hours', threshold: 1500, title: '25 Hours Practiced!', message: 'Your dedication is showing!', icon: '🎶' },
  { id: 'hours_50', type: 'hours', threshold: 3000, title: '50 Hours Practiced!', message: 'You\'re a committed musician!', icon: '🎸' },
  { id: 'hours_100', type: 'hours', threshold: 6000, title: '100 Hours Practiced!', message: 'You\'re becoming a master!', icon: '🏆' },
  { id: 'hours_250', type: 'hours', threshold: 15000, title: '250 Hours Practiced!', message: 'Incredible dedication!', icon: '⭐' },
  { id: 'hours_500', type: 'hours', threshold: 30000, title: '500 Hours Practiced!', message: 'You\'re a true professional!', icon: '👑' },
  { id: 'hours_1000', type: 'hours', threshold: 60000, title: '1000 Hours Practiced!', message: 'Legendary status achieved!', icon: '💎' },
  
  // Sessions
  { id: 'sessions_10', type: 'sessions', threshold: 10, title: '10 Sessions Complete!', message: 'You\'re building momentum!', icon: '🔥' },
  { id: 'sessions_50', type: 'sessions', threshold: 50, title: '50 Sessions Complete!', message: 'Consistency is key!', icon: '💪' },
  { id: 'sessions_100', type: 'sessions', threshold: 100, title: '100 Sessions Complete!', message: 'You\'re unstoppable!', icon: '🚀' },
  { id: 'sessions_365', type: 'sessions', threshold: 365, title: '365 Sessions Complete!', message: 'A full year of practice!', icon: '🎉' },
  
  // Streaks
  { id: 'streak_7', type: 'streak', threshold: 7, title: '7-Day Streak!', message: 'One week of dedication!', icon: '🔥' },
  { id: 'streak_30', type: 'streak', threshold: 30, title: '30-Day Streak!', message: 'You\'ve built a habit!', icon: '⚡' },
  { id: 'streak_100', type: 'streak', threshold: 100, title: '100-Day Streak!', message: 'Absolutely incredible!', icon: '💯' },
  { id: 'streak_365', type: 'streak', threshold: 365, title: '365-Day Streak!', message: 'A full year without missing a day!', icon: '👑' },
  
  // Levels
  { id: 'level_5', type: 'level', threshold: 5, title: 'Level 5 Reached!', message: 'You\'re leveling up!', icon: '⬆️' },
  { id: 'level_10', type: 'level', threshold: 10, title: 'Level 10 Reached!', message: 'Double digits!', icon: '🎯' },
  { id: 'level_25', type: 'level', threshold: 25, title: 'Level 25 Reached!', message: 'Quarter century!', icon: '🌟' },
  { id: 'level_50', type: 'level', threshold: 50, title: 'Level 50 Reached!', message: 'Elite musician status!', icon: '👑' }
];
