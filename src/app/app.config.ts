import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { authReducer, initialState } from './core/store/auth/auth.reducer';
import { taskReducer } from './core/store/task/task.reducer';

export const appProviders = [
  provideRouter(routes),
  provideStore(),
  provideState({
    name: 'auth',
    reducer: authReducer
  }),
  provideState({
    name: 'task',
    reducer: taskReducer
  })
];

export const appConfig: ApplicationConfig = {
  providers: appProviders
};