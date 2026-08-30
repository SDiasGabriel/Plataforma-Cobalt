import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      // Quando o modulo de clientes for criado:
      // {
      //   path: 'clientes',
      //   loadChildren: () =>
      //     import('./features/clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
      // },
      // Quando o modulo de empresas for criado:
      // {
      //   path: 'empresas',
      //   loadChildren: () =>
      //     import('./features/companies/companies.routes').then((m) => m.COMPANIES_ROUTES),
      // },
      // Quando o modulo de documentos for criado:
      // {
      //   path: 'documentos',
      //   loadChildren: () =>
      //     import('./features/documents/documents.routes').then((m) => m.DOCUMENTS_ROUTES),
      // },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '404' },
];
