import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

const routes: Routes = [
    {
        // List of projects
        path: '',
        component: ProjectsComponent
    },
    {
        // Details of specific project
        path: ':id',
        component: ProjectsComponent
    },
    {
        // Edit a project
        path: ':id/edit',
        component: ProjectEditComponent
    },
    {
        // Create a new project
        path: 'new',
        component: ProjectEditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {}
