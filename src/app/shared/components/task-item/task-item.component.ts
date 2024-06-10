import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Task } from '../../../core/models/task.model';
import { deleteTask, updateTask } from '../../../core/store/task/task.action';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;

  private store = inject(Store)
  private taskService = inject(TaskService);

  onChangeTask(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const updatedTask: Task = { ...this.task, checked };

    this.taskService.updateTask(updatedTask).subscribe({
      next: (task) => this.store.dispatch(updateTask({ task }))
    });
  }

  onDeleteTask() {
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => this.store.dispatch(deleteTask({ id: this.task.id }))
    });
  }
}
