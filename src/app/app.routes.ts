import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: 'tasks', loadChildren: () => import('./pages/task/task.routes').then(m => m.TASK_ROUTES) },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
