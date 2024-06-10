import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private validUsername = 'test01';
  private validPassword = 'test01';
  private authToken = 'tsctesttoken';

  login(username: string, password: string): Observable<User> {
    return new Observable((observer) => {
      const isValid = username === this.validUsername && password === this.validPassword;
      if (!isValid) throw new Error('Credenciales inválidas');
      else {
        localStorage.setItem('auth-token', this.authToken);
        observer.next({ username });
      }
    })
  }

  logout(): Observable<void> {
    return new Observable((observer) => {
      localStorage.removeItem('auth-token');
      observer.next();
    });
  }

  isLoggedIn(): boolean {
    const localToken = localStorage.getItem('auth-token');
    return localToken === this.authToken;
  }

  getUser(): User {
    return { username: this.validUsername };
  }
}
