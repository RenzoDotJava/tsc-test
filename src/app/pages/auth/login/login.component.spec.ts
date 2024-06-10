import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { appProviders } from '../../../app.config';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { selectUser } from '../../../core/store/auth/auth.selector';

describe('LoginComponent', () => {
  let store: Store;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let storage: { [key: string]: string } = {};

  beforeAll(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return storage[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      storage[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete storage[key];
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, CommonModule],
      providers: [appProviders]
    }).compileComponents();

    store = TestBed.inject(Store);

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    router.initialNavigation();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Login');
  });

  it('should show error messages when user submit form without data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const form = fixture.debugElement.query(By.css('form'));

    form.triggerEventHandler('submit', null);

    fixture.detectChanges();

    expect(compiled.querySelector('#error-user')?.textContent).toContain('El usuario es requerido');
    expect(compiled.querySelector('#error-password')?.textContent).toContain('La contraseña es requerida');
  });

  it('should show an alert when user submit invalid credentials', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const form = fixture.debugElement.query(By.css('form'));

    component.loginForm.controls['username'].setValue('wrong-user');
    component.loginForm.controls['password'].setValue('wrong-password');

    form.triggerEventHandler('submit', null);

    fixture.detectChanges();

    expect(compiled.querySelector('.alert-danger')).toBeTruthy();
  });

  it('should navigate to /tasks when user submit valid credentials', () => {
    const form = fixture.debugElement.query(By.css('form'));

    component.loginForm.controls['username'].setValue('test01');
    component.loginForm.controls['password'].setValue('test01');

    form.triggerEventHandler('submit', null);

    fixture.detectChanges();

    const user$ = store.pipe(select(selectUser)).subscribe((user) => {
      expect(user?.username).toBe('test01');
    })

    expect(router.navigate).toHaveBeenCalledWith(['tasks']);

    user$.unsubscribe();
  });
});
