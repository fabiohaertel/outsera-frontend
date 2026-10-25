import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'list',
    title: 'List movies',
    loadComponent: () => import('./features/movie-list/movie-list').then((m) => m.MovieList),
  },
  { path: '**', redirectTo: 'dashboard' },
];
