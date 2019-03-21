import { Component, OnInit, Input } from '@angular/core';
import { Project, AuthService, User } from 'src/app/shared';

@Component({
    selector: 'app-project-item',
    templateUrl: './project-item.component.html',
    styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {
    @Input() private project: Project;
    @Input() private manager: User;

    constructor() {}

    ngOnInit() {}

    getProjectCardType(): string {
        // if (Date.now() >= this.project.dateDue) {
        if (this.project.status === 'Late') {
            return 'text-white bg-danger';
        } else {
            return 'text-white bg-primary';
        }
    }

    getProjectProgressBarType(): string {
        if (this.project.status === 'Late') {
            return 'danger';
        } else {
            return 'primary';
        }
    }

    getProject(): Project {
        return this.project;
    }

    getManager(): User {
        return this.manager;
    }
}
