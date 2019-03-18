import { Component, OnInit, Input } from '@angular/core';
import { Project, AuthService } from 'src/app/shared';

@Component({
    selector: 'app-project-item',
    templateUrl: './project-item.component.html',
    styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {
    @Input() private project: Project;
    @Input() private index: number;

    constructor(private authService: AuthService) {}

    ngOnInit() {}

    getProject(): Project {
        return this.project;
    }

    getIndex(): number {
        return this.index;
    }

    getUser(): firebase.User {
        return this.authService.getCurrentUser();
    }
}
