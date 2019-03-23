import { Component, OnInit } from '@angular/core';
import { Project, UserService } from 'src/app/shared';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
    private project: Project;
    private canEdit: boolean;

    constructor(
        private afa: AngularFireAuth,
        private projectService: ProjectService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.project = this.projectService.getProjectById(params.id);
            this.canEdit = this.project.manager === this.afa.auth.currentUser.uid;
        });
    }

    getProject(): Project {
        return this.project;
    }

    getManager(uid: string): string {
        return this.userService.getUserById(uid).displayName;
    }

    getCanEdit(): boolean {
        return this.canEdit;
    }
}
