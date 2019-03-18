import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/shared';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
    private project: Project;

    constructor(private projectService: ProjectService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.project = this.projectService.getProjectById(params.id);
        });
    }

    getProject(): Project {
        return this.project;
    }
}
