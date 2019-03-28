import { Component, OnInit, Input } from '@angular/core';
import { TaskService, Task } from 'src/app/shared';
import { Router } from '@angular/router';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
    @Input() private projectId: string;

    private tasks: Task[] = [];

    constructor(private taskService: TaskService, private router: Router) {}

    ngOnInit() {
        this.taskService.getTasksByProjectId(this.projectId).then((tasks: Task[]) => {
            this.tasks = tasks;
        });
    }

    getTasks(): Task[] {
        return this.tasks;
    }

    onTaskClick(id: string): void {
        // this.router.navigate(['task' + id]);
    }
}
