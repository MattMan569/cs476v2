import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { TaskEditComponent } from './tasks/task-edit/task-edit.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        children: [
            { path: '', component: ProjectListComponent }, // Project list
            { path: 'new', component: ProjectEditComponent }, // New project
            { path: ':id', component: ProjectDetailComponent }, // Project details
            { path: ':id/edit', component: ProjectEditComponent }, // Edit project
            { path: ':id/addTask', component: TaskEditComponent }, // Add new task
            { path: ':id/:tid', component: TaskDetailComponent }, // Task details
            { path: ':id/:tid/edit', component: TaskEditComponent } // Edit task
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {}
