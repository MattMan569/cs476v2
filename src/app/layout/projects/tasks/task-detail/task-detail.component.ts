import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task, TaskService, UserService } from 'src/app/shared';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
    private task: Promise<Task>;
    private canEdit = false;
    private canDelete = false;

    constructor(
        private afa: AngularFireAuth,
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.task = this.taskService.getTaskById(params.tid);
            this.task.then(task => {
                // Task assignees and the project manager can edit tasks
                const currentUser = this.afa.auth.currentUser.uid;
                if (currentUser === task.assignedBy || currentUser === task.assignedTo) {
                    this.canEdit = true;
                }
                if (currentUser === task.assignedBy) {
                    this.canDelete = true;
                }
            });
        });
    }

    // Delete the task
    onDeleteTask(): void {
        // Confirm the selection
        if (confirm('Are you sure you want to delete this project?\nThis action cannot be undone.')) {
            this.task.then((task: Task) => {
                // Delete the task
                this.taskService.deleteTask(task).then(() => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                });
            });
        }
    }

    getTask(): Promise<Task> {
        return this.task;
    }

    getUser(uid: string): string {
        return this.userService.getUserById(uid).displayName;
    }

    getCanEdit(): boolean {
        return this.canEdit;
    }

    getCanDelete(): boolean {
        return this.canDelete;
    }
}
