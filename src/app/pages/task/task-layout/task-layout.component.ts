import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { selectUser } from '../../../core/store/auth/auth.selector';
import { logout } from '../../../core/store/auth/auth.action';

@Component({
  selector: 'app-task-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './task-layout.component.html',
  styleUrl: './task-layout.component.scss'
})
export class TaskLayoutComponent {
  private store = inject(Store)
  private authService = inject(AuthService);
  private router = inject(Router)

  user$: Observable<User | null> = this.store.pipe(select(selectUser));

  onCloseSession() {
    this.authService.logout().subscribe({
      next: () => {
        this.store.dispatch(logout())
        this.router.navigate(['login']);
      },
    });
  }
}
