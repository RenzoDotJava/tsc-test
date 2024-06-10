import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { Task } from '../../../core/models/task.model';
import { selectTasks } from '../../../core/store/task/task.selector';
import { addTask, deleteTask, loadTasks, updateTask } from '../../../core/store/task/task.action';
import { TaskItemComponent } from '../../../shared/components/task-item/task-item.component';
import { AlphanumericDirective } from '../../../shared/directives/alphanumeric.directive';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TaskItemComponent, AlphanumericDirective],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private store = inject(Store)
  private formBuilder = inject(FormBuilder);
  private taskService = inject(TaskService);

  tasks$: Observable<Task[]> = this.store.pipe(select(selectTasks))
  taskForm: FormGroup;
  isLoading = true;

  constructor() {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.getTaks();
  }

  getTaks() {
    this.taskService.getTasks().pipe(debounceTime(500)).subscribe({
      next: (tasks) => {
        this.store.dispatch(loadTasks({ tasks }));
        this.isLoading = false;
      }
    });
  }

  onSubmitTask() {
    if (!this.taskForm.valid) return;
    this.taskService.addTask(this.taskForm.value.name).subscribe({
      next: (task) => {
        this.store.dispatch(addTask({ task }));
        this.taskForm.reset();
      }
    })
  }

  /* onChangeTask(event: Event, task: Task) {
    console.log('xdxd')
    const checked = (event.target as HTMLInputElement).checked;
    const updatedTask: Task = { ...task, checked };

    this.taskService.updateTask(updatedTask).subscribe({
      next: (task) => this.store.dispatch(updateTask({ task }))
    });
  }

  onDeleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => this.store.dispatch(deleteTask({ id: task.id }))
    });
  } */
}
