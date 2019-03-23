import { Component, OnInit, Input } from '@angular/core';
import { Project, AuthService, User, TaskService, Task } from 'src/app/shared';

@Component({
    selector: 'app-project-item',
    templateUrl: './project-item.component.html',
    styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {
    @Input() private project: Project;
    @Input() private manager: User;
    private progressPromise: Promise<number>;

    constructor(private taskService: TaskService) {}

    ngOnInit() {
        this.taskService.getTasksByProjectId(this.project.id).then((tasks: Task[]) => {
            let completedWeight = 0;
            let totalWeight = 0;

            // This project has no tasks
            if (tasks.length === 0) {
                this.progressPromise = Promise.resolve(0);
                return;
            }

            // Get the total and complete weight
            tasks.forEach(task => {
                totalWeight += task.weight;
                if (task.status === 'Complete') {
                    completedWeight += task.weight;
                }
            });

            const ratio = Math.round((completedWeight / totalWeight) * 100);
            this.progressPromise = Promise.resolve(ratio);
        });
    }

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

    getProjectProgress(): Promise<number> {
        return this.progressPromise;
    }
}
