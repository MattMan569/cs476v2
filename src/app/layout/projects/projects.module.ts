import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectItemComponent } from './project-list/project-item/project-item.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskEditComponent } from './tasks/task-edit/task-edit.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { TaskItemComponent } from './tasks/task-list/task-item/task-item.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, NgbModule, ProjectsRoutingModule],
    declarations: [
        ProjectsComponent,
        ProjectEditComponent,
        ProjectListComponent,
        ProjectItemComponent,
        ProjectDetailComponent,
        TasksComponent,
        TaskEditComponent,
        TaskListComponent,
        TaskItemComponent,
        TaskDetailComponent
    ]
})
export class ProjectsModule {}
