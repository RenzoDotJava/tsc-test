import { createReducer, on } from '@ngrx/store';

import { login, logout } from './auth.action';
import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
}

export const initialState: AuthState = {
  user: null
};

export const authReducer = createReducer(
  initialState,
  on(login, (_, { user }) => ({ user })),
  on(logout, () => ({ user: null }))
);