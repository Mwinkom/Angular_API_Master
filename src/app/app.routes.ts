import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/post-list/post-list.component')
      .then(m => m.PostListComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./components/post-detail/post-detail.component')
      .then(m => m.PostDetailComponent)
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () => import('./components/post-form/post-form.component')
      .then(m => m.PostFormComponent)
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/post-form/post-form.component')
      .then(m => m.PostFormComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
