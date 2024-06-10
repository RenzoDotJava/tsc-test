import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { login } from '../../../core/store/auth/auth.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private store = inject(Store)
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)

  isPasswordVisible = false;
  errorMsg: string = '';
  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmitLogin() {
    if (!this.loginForm.valid) this.loginForm.markAllAsTouched();
    else {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (user) => {
          this.errorMsg = '';
          this.store.dispatch(login({ user }));
          this.router.navigate(['tasks']);
        },
        error: (error) => this.errorMsg = error.message
      });
    }
  }

  toggleVisibility(e: Event) {
    e.preventDefault();
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  hasError(control: string, error: string) {
    return this.loginForm.controls[control].touched &&
      this.loginForm.controls[control].invalid &&
      this.loginForm.controls[control].hasError(error);
  }
}

