import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { TaskService, Task, UserService, MessageServiceFactory, ProjectService } from 'src/app/shared';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
    private taskForm: FormGroup;
    private task: Task;
    private pid: string; // Project id
    private tid: string; // Task id
    private editMode = false;
    private isInvalidUser = false;
    private isManager = false;
    private submitAttempted = false;

    constructor(
        private afs: AngularFirestore,
        private afa: AngularFireAuth,
        private taskService: TaskService,
        private projectService: ProjectService,
        private userService: UserService,
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
            this.taskService.getTaskById(this.tid).then((task: Task) => {
                this.task = task;
                if (task.assignedBy === this.afa.auth.currentUser.uid) {
                    this.isManager = true;
                }

                const date = new Date(task.dateDue);
                this.taskForm = new FormGroup({
                    description: new FormControl(task.description, Validators.required),
                    dateDue: new FormControl(
                        { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() },
                        Validators.required
                    ),
                    weight: new FormControl(task.weight, Validators.required),
                    status: new FormControl(task.status, Validators.required),
                    assignedTo: new FormControl(this.userService.getUserById(task.assignedTo).displayName, Validators.required)
                });
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
        // Only allow the submission of valid forms
        if (!this.taskForm.valid) {
            this.submitAttempted = true;
            return;
        }

        let newTask: Task;
        let formDate = '';

        // Get the form
        newTask = this.taskForm.value;

        // Format the date and get the timestamp
        formDate += this.taskForm.value.dateDue.year + '-';
        formDate += this.taskForm.value.dateDue.month + '-';
        formDate += this.taskForm.value.dateDue.day;
        newTask.dateDue = new Date(formDate).valueOf();

        if (this.editMode) {
            if (newTask.status === 'Complete') {
                // @ts-ignore Ignore the imcomplete instantiation, it is done by the service
                const systemMessage: PrivateMessage = {
                    message:
                        'User ' +
                        this.afa.auth.currentUser.displayName +
                        ' has completed task:<br><span class="pl-5">' +
                        newTask.description +
                        '</span><br>In project: ' +
                        this.projectService.getProjectById(this.pid).name,
                    subject: 'Task Completion'
                };
                systemMessage.recipientId = this.task.assignedBy;
                MessageServiceFactory.CreateMessageService('System Message', this.afa, this.afs).sendMessage(systemMessage);
            }
            newTask.id = this.tid;
            this.taskService.updateTask(newTask).then(() => this.router.navigate(['..'], { relativeTo: this.route }));
            return;
        }

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

    managerFieldsDisabled(): boolean {
        return this.editMode && !this.isManager;
    }

    isFormInvalid(): boolean {
        if (this.submitAttempted) {
            this.taskForm.controls.description.markAsTouched();
            this.taskForm.controls.dateDue.markAsTouched();
            this.taskForm.controls.assignedTo.markAsTouched();
        }
        if (this.taskForm.get('assignedTo').touched && this.taskForm.get('description').touched && this.taskForm.get('dateDue').touched) {
            return this.taskForm.invalid;
        }
    }
}
