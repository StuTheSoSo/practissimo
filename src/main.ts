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
    path: 'settings',
    loadComponent: () => import('./app/pages/settings/settings.page').then(m => m.SettingsPage)
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular()
  ]
});
