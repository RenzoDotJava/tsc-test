import { createAction, props } from "@ngrx/store";

import { Task } from "../../models/task.model";

export const loadTasks = createAction('[Task Page] Load', props<{ tasks: Task[] }>());
export const addTask = createAction('[Task Page] Add', props<{ task: Task }>());
export const updateTask = createAction('[Task Page] Update', props<{ task: Task }>());
export const deleteTask = createAction('[Task Page] Delete', props<{ id: string }>());
