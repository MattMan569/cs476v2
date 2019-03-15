import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
    imports: [CommonModule, ProjectsRoutingModule],
    declarations: [ProjectsComponent, ProjectEditComponent, ProjectListComponent]
})
export class ProjectsModule {}
