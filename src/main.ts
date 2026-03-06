import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./app/pages/onboarding/onboarding.page').then(m => m.OnboardingPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./app/pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'practice',
    loadComponent: () => import('./app/pages/practice/practice.page').then(m => m.PracticePage)
  },
  {
    path: 'chord-charts',
    loadComponent: () => import('./app/pages/chord-charts/chord-charts.page').then(m => m.ChordChartsPage)
  },
  {
    path: 'tuner',
    loadComponent: () => import('./app/pages/tuner/tuner.page').then(m => m.TunerPage)
  },
  {
    path: 'pitch-finder',
    loadComponent: () => import('./app/pages/pitch-finder/pitch-finder.page').then(m => m.PitchFinderPage)
  },
  {
    path: 'quests',
    loadComponent: () => import('./app/pages/quests/quests.page').then(m => m.QuestsPage)
  },
  {
    path: 'achievements',
    loadComponent: () => import('./app/pages/achievements/achievements.page').then(m => m.AchievementsPage)
  },
  {
    path: 'history',
    loadComponent: () => import('./app/pages/history/history.page').then(m => m.HistoryPage)
  },
  {
    path: 'goals',
    loadComponent: () => import('./app/pages/goals/goals.page').then(m => m.GoalsPage)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./app/pages/analytics/analytics.page').then(m => m.AnalyticsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./app/pages/settings/settings.page').then(m => m.SettingsPage)
  },
  {
    path: 'help',
    loadComponent: () => import('./app/pages/help/help.page').then(m => m.HelpPage)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./app/pages/privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPage)
  },
  {
    path: 'terms-of-use-android',
    loadComponent: () => import('./app/pages/terms-of-use-android/terms-of-use-android.page').then(m => m.TermsOfUseAndroidPage)
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular()
  ]
});
