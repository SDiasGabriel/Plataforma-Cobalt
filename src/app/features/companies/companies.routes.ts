import { Routes } from '@angular/router';

export const COMPANIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./companies-home/companies-home').then((m) => m.CompaniesHome),
  },
];
