import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private getLocalStorageTasks(): Task[] {
    const localTasks = localStorage.getItem('tasks')
    return localTasks ? JSON.parse(localTasks) : [];
  }

  private setLocalStorageTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  getTasks(): Observable<Task[]> {
    return new Observable(observer => {
      const tasks = this.getLocalStorageTasks();
      observer.next(tasks);
    })
  }

  addTask(name: string): Observable<Task> {
    return new Observable(observer => {
      const newTask: Task = { id: uuidv4(), name, checked: false }

      const tasks = this.getLocalStorageTasks();

      tasks.push(newTask);

      this.setLocalStorageTasks(tasks);

      observer.next(newTask);
    })
  }

  updateTask(task: Task): Observable<Task> {
    return new Observable(observer => {
      const tasks = this.getLocalStorageTasks();

      const updatedTasks = tasks.map(t => t.id === task.id ? task : t);

      this.setLocalStorageTasks(updatedTasks);

      observer.next(task);
    })
  }

  deleteTask(id: string): Observable<void> {
    return new Observable(observer => {
      const tasks = this.getLocalStorageTasks();

      const updatedTasks = tasks.filter(t => t.id !== id);

      this.setLocalStorageTasks(updatedTasks);

      observer.next();
    })
  }
}
