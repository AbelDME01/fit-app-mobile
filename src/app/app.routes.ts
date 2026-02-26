import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./features/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'add-workout',
        loadComponent: () => import('./features/add-workout/add-workout.page').then(m => m.AddWorkoutPage),
      },
      {
        path: 'records',
        loadComponent: () => import('./features/records/records.page').then(m => m.RecordsPage),
      },
      {
        path: 'progress',
        loadComponent: () => import('./features/progress/progress.page').then(m => m.ProgressPage),
      },
    ],
  },
];
