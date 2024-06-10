import { createReducer, on } from '@ngrx/store';

import { addTask, deleteTask, loadTasks, updateTask } from './task.action';
import { Task } from '../../models/task.model';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: []
}

export const taskReducer = createReducer(
  initialState,
  on(loadTasks, (_, { tasks }) => ({ tasks })),
  on(addTask, (state, { task }) => ({ tasks: [...state.tasks, task] })),
  on(updateTask, (state, { task }) => ({ tasks: state.tasks.map(t => t.id === task.id ? task : t) })),
  on(deleteTask, (state, { id }) => ({ tasks: state.tasks.filter(t => t.id !== id) }))
);

