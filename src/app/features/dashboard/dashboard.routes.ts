import { Routes } from '@angular/router';
import { dashboardUserResolver } from './resolvers/dashboard-user.resolver';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    resolve: {
      usuario: dashboardUserResolver,
    },
    loadComponent: () =>
      import('./pages/dashboard-home/dashboard-home').then((m) => m.DashboardHome),
  },
];
