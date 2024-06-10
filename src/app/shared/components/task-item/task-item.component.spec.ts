import { ComponentFixture, TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';

import { TaskItemComponent } from './task-item.component';
import { appProviders } from '../../../app.config';
import { loadTasks } from '../../../core/store/task/task.action';
import { By } from '@angular/platform-browser';
import { selectTasks } from '../../../core/store/task/task.selector';



describe('TaskItemComponent', () => {
  let store: Store;
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const taskMock = { id: '1', name: 'Task 1', checked: false };
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
      imports: [TaskItemComponent],
      providers: [appProviders]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;

    store.dispatch(loadTasks({ tasks: [taskMock] }));
    component.task = taskMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the task name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label')?.textContent).toContain(taskMock.name);
  })

  it('should update the task when the checkbox is clicked', () => {
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;

    checkbox.click();
    fixture.detectChanges();

    const tasks$ = store.pipe(select(selectTasks)).subscribe((tasks) => {
      expect(tasks[0].checked).toBe(true);
    })

    expect(checkbox.checked).toBe(true);

    tasks$.unsubscribe();
  })

  it('should delete the task when the delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('button')).nativeElement;

    deleteButton.click();
    fixture.detectChanges();

    const tasks$ = store.pipe(select(selectTasks)).subscribe((tasks) => {
      expect(tasks.length).toBe(0);
    })

    tasks$.unsubscribe();
  })
});
