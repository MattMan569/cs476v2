import { Component, OnInit, Input } from '@angular/core';
import { Task, UserService } from 'src/app/shared';

@Component({
    selector: '[app-task-item]',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {
    @Input() private task: Task;

    constructor(private userService: UserService) {}

    ngOnInit() {}

    getTask(): Task {
        return this.task;
    }

    getDateCreated() {
        const date = new Date(this.task.dateCreated);
        return date.toLocaleDateString();
    }

    getDateDue() {
        const date = new Date(this.task.dateDue);
        return date.toLocaleDateString();
    }

    getAssignee() {
        const assignee = this.userService.getUserById(this.task.assignedTo);
        if (assignee) {
            return assignee.displayName;
        } else {
            return 'Invalid User!';
        }
    }
}
