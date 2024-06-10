import { Routes } from "@angular/router";

import { TaskListComponent } from "./task-list/task-list.component";
import { TaskLayoutComponent } from "./task-layout/task-layout.component";
import { SecureGuard } from "../../core/guards/secure.guard";

export const TASK_ROUTES: Routes = [
  {
    path: '', component: TaskLayoutComponent, children: [
      { path: '', component: TaskListComponent, canActivate: [SecureGuard] }
    ]
  }
]