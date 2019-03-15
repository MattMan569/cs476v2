import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

@NgModule({
    imports: [CommonModule, ProjectsRoutingModule],
    declarations: [ProjectsComponent, ProjectEditComponent]
})
export class ProjectsModule {}
