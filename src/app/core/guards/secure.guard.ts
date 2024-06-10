import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from '../services/auth.service';
import { login } from '../store/auth/auth.action';

export const SecureGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const store = inject(Store);

  if (authService.isLoggedIn()) {
    store.dispatch(login({ user: authService.getUser() }));
    return true
  } else {
    router.navigate(['/login']);
    return false;
  }
};

