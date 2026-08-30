import { Routes } from '@angular/router';
import { guestGuard } from '../../core/auth/guest-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'cadastro',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/cadastro-cliente/cadastro-cliente').then((m) => m.CadastroCliente),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  { path: '', pathMatch: 'full', redirectTo: 'cadastro' },
];
