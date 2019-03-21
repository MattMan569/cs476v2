import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { TaskService, Task } from 'src/app/shared';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
    private taskForm: FormGroup;
    private pid: string; // Project id
    private tid: string; // Task id
    private editMode = false;
    private isInvalidUser = false;

    constructor(
        private afs: AngularFirestore,
        private afa: AngularFireAuth,
        private taskService: TaskService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // Check if an existing form is being edited
        this.route.params.subscribe((params: Params) => {
            this.editMode = params.tid != null;
            this.pid = params.id;
            this.tid = params.tid;
        });

        if (this.editMode) {
            this.taskForm = new FormGroup({
                description: new FormControl(null, Validators.required),
                dateDue: new FormControl(null, Validators.required),
                weight: new FormControl(1, Validators.required),
                status: new FormControl('In Progress', Validators.required),
                assignedTo: new FormControl(null, Validators.required)
            });
        } else {
            this.taskForm = new FormGroup({
                description: new FormControl(null, Validators.required),
                dateDue: new FormControl(null, Validators.required),
                weight: new FormControl(1, Validators.required),
                status: new FormControl('In Progress', Validators.required),
                assignedTo: new FormControl(null, Validators.required)
            });
        }

        // Prevent the datepicker from moving the view
        NgbDatepicker.prototype.focus = function() {
            this._elementRef.nativeElement.focus();
        };
    }

    onSubmit() {
        let newTask: Task;
        let formDate = '';

        // Get the form
        newTask = this.taskForm.value;

        // Format the date and get the timestamp
        formDate += this.taskForm.value.dateDue.year + '-';
        formDate += this.taskForm.value.dateDue.month + '-';
        formDate += this.taskForm.value.dateDue.day;
        newTask.dateDue = new Date(formDate).valueOf();

        newTask.id = -1 + '';
        newTask.projectId = this.pid;
        newTask.assignedBy = this.afa.auth.currentUser.uid;
        newTask.dateCreated = Date.now();
        newTask.dateCompleted = null;

        // Add the document
        this.taskService
            .addTask(newTask)
            .then(() => this.router.navigate(['..'], { relativeTo: this.route }))
            .catch(() => (this.isInvalidUser = true));
    }

    // Navigate up one level
    onCancel() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }

    getForm() {
        return this.taskForm;
    }

    getSubmitButtonText(): string {
        if (this.editMode) {
            return 'Update Task';
        } else {
            return 'Create Task';
        }
    }

    getIsInvalidUser(): boolean {
        return this.isInvalidUser;
    }
}
