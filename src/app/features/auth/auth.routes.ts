import { Routes } from '@angular/router';
import { publicGuard } from '@core/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage),
    canActivate: [publicGuard],
  },
];
