import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TaskListComponent } from './task-list.component';
import { TaskItemComponent } from '../../../shared/components/task-item/task-item.component';
import { AlphanumericDirective } from '../../../shared/directives/alphanumeric.directive';
import { appProviders } from '../../../app.config';
import { select, Store } from '@ngrx/store';
import { loadTasks } from '../../../core/store/task/task.action';
import { selectTasks } from '../../../core/store/task/task.selector';

describe('TaskListComponent', () => {
  let store: Store;
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
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
      imports: [TaskListComponent, ReactiveFormsModule, CommonModule, TaskItemComponent, AlphanumericDirective],
      providers: [appProviders]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('LISTA DE TAREAS');
  });

  it('should disable the submit button when the form is empty', () => {
    const submitEl = fixture.debugElement.query(By.css('button[type="submit"]'));

    expect(submitEl.nativeElement.disabled).toBe(true);
  });

  it('should show a loading spinner when the tasks are loading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#loading-message')?.textContent).toContain('Obteniendo tareas...');
  });

  it('should show an empty list message when there are no tasks', async () => {
    await fixture.whenStable()
    fixture.detectChanges()

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#empty-message')?.textContent).toContain('No hay tareas');
  });

  it('should show the task added', async () => {
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.css('form'));
    const inputEl = fixture.debugElement.query(By.directive(AlphanumericDirective)).nativeElement

    inputEl.value = 'Task 1';
    inputEl.dispatchEvent(new Event('input'));

    form.triggerEventHandler('submit', null);

    fixture.detectChanges();

    const tasks$ = store.pipe(select(selectTasks)).subscribe((tasks) => {
      expect(tasks.length).toBe(1);
    })

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-task-item').length).toBe(1);

    tasks$.unsubscribe();
  });

  it('should show a list of N tasks', async () => {
    await fixture.whenStable();

    const mockTasks = [{ id: '1', name: 'Task 1', checked: false }, { id: '2', name: 'Task 2', checked: false }];

    store.dispatch(loadTasks({ tasks: mockTasks }));

    fixture.detectChanges();

    const tasks$ = store.pipe(select(selectTasks)).subscribe((tasks) => {
      expect(mockTasks.length).toBe(2);
    })

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-task-item').length).toBe(mockTasks.length);

    tasks$.unsubscribe();
  });
});
