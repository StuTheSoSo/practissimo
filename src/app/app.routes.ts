import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.page').then((m) => m.AnalyticsPage),
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.page').then((m) => m.HelpPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
