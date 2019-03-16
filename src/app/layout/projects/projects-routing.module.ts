import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        children: [
            { path: '', component: ProjectListComponent }, // Project list
            { path: 'new', component: ProjectEditComponent }, // New project
            { path: ':id', component: ProjectListComponent }, // Project details
            { path: ':id/edit', component: ProjectEditComponent } // Edit project
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {}
