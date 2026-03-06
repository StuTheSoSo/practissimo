import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'practice',
    loadComponent: () => import('./pages/practice/practice.page').then((m) => m.PracticePage),
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.page').then((m) => m.AnalyticsPage),
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.page').then((m) => m.HistoryPage),
  },
  {
    path: 'goals',
    loadComponent: () => import('./pages/goals/goals.page').then((m) => m.GoalsPage),
  },
  {
    path: 'quests',
    loadComponent: () => import('./pages/quests/quests.page').then((m) => m.QuestsPage),
  },
  {
    path: 'achievements',
    loadComponent: () => import('./pages/achievements/achievements.page').then((m) => m.AchievementsPage),
  },
  {
    path: 'tuner',
    loadComponent: () => import('./pages/tuner/tuner.page').then((m) => m.TunerPage),
  },
  {
    path: 'pitch-finder',
    loadComponent: () => import('./pages/pitch-finder/pitch-finder.page').then((m) => m.PitchFinderPage),
  },
  {
    path: 'chord-charts',
    loadComponent: () => import('./pages/chord-charts/chord-charts.page').then((m) => m.ChordChartsPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.page').then((m) => m.HelpPage),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then((m) => m.PrivacyPolicyPage),
  },
  {
    path: 'terms-of-use-android',
    loadComponent: () => import('./pages/terms-of-use-android/terms-of-use-android.page').then((m) => m.TermsOfUseAndroidPage),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
