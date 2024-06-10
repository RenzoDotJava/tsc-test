import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';

import { TaskLayoutComponent } from './task-layout.component';
import { appProviders } from '../../../app.config';
import { login, logout } from '../../../core/store/auth/auth.action';
import { By } from '@angular/platform-browser';
import { selectUser } from '../../../core/store/auth/auth.selector';

describe('TaskLayoutComponent', () => {
  let router: Router;
  let store: Store;
  let component: TaskLayoutComponent;
  let fixture: ComponentFixture<TaskLayoutComponent>;
  const userMock = { username: 'test01' };
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
      imports: [TaskLayoutComponent, RouterOutlet, CommonModule],
      providers: [appProviders]
    }).compileComponents();

    store = TestBed.inject(Store);


    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    router.initialNavigation();

    store.dispatch(login({ user: userMock }));

    fixture = TestBed.createComponent(TaskLayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the username', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#username')?.textContent).toContain(userMock.username);
  })

  it('should show anonymous when the user is not logged in', async () => {
    store.dispatch(logout());

    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#anonymous')?.textContent).toContain('Anónimo');
  });

  it('should navigate to /login when the user click the logout button', () => {
    const deleteButton = fixture.debugElement.query(By.css('#logout')).nativeElement;

    deleteButton.click();

    const user$ = store.pipe(select(selectUser)).subscribe((user) => {
      expect(user).toBeNull();
    })

    expect(router.navigate).toHaveBeenCalledWith(['login']);

    user$.unsubscribe();
  })
});
