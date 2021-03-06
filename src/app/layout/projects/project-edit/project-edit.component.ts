import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Project, TaskService, Task } from 'src/app/shared';
import { ProjectService } from 'src/app/shared/services/project.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-project-edit',
    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
    private projectForm: FormGroup;
    private id: string;
    private editMode = false;
    private completedDisabled = true;
    private canceledDisabled = true;
    private submitAttempted = false;

    constructor(
        private afa: AngularFireAuth,
        private projectService: ProjectService,
        private taskService: TaskService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // Check if an existing form is being edited
        this.route.params.subscribe((params: Params) => {
            this.editMode = params.id != null;
            this.id = params.id;

            // If the project id is found
            if (this.id) {
                this.canceledDisabled = false;

                // Get all tasks for this project
                this.taskService.getTasksByProjectId(this.id).then((tasks: Task[]) => {
                    if (tasks.length !== 0) {
                        let allCompleted = true;
                        tasks.forEach((task: Task) => {
                            if (task.status !== 'Complete') {
                                allCompleted = false;
                            }
                        });
                        // Disable the completed status unless all tasks are complete
                        this.completedDisabled = !allCompleted;
                    }
                });
            }
        });

        // If the form is in edit mode for an existing project
        if (this.editMode) {
            // Setup a prepopulated form
            const selectedProject = this.projectService.getProjectById(this.id);
            const date = new Date(selectedProject.dateDue);
            this.projectForm = new FormGroup({
                name: new FormControl(selectedProject.name, Validators.required),
                description: new FormControl(selectedProject.description, Validators.required),
                dateDue: new FormControl({ year: date.getFullYear(), month: date.getMonth(), day: date.getDate() }, Validators.required),
                status: new FormControl(selectedProject.status, Validators.required),
                priority: new FormControl(selectedProject.priority, Validators.required)
            });
        } else {
            // Setup a blank form
            this.projectForm = new FormGroup({
                name: new FormControl(null, Validators.required),
                description: new FormControl(null, Validators.required),
                dateDue: new FormControl(null, Validators.required),
                status: new FormControl('In Progress', Validators.required),
                priority: new FormControl('Normal', Validators.required)
            });
        }

        // Prevent the datepicker from moving the view
        NgbDatepicker.prototype.focus = function() {
            this._elementRef.nativeElement.focus();
        };
    }

    onSubmit() {
        // Only allow the submission of valid forms
        if (!this.projectForm.valid) {
            this.submitAttempted = true;
            return;
        }

        let newProject: Project;
        let formDate = '';

        // Get the form
        newProject = this.projectForm.value;

        // Format the date and get the timestamp
        formDate += this.projectForm.value.dateDue.year + '-';
        formDate += this.projectForm.value.dateDue.month + '-';
        formDate += this.projectForm.value.dateDue.day;
        newProject.dateDue = new Date(formDate).valueOf();

        // If a project is being edited
        if (this.editMode) {
            // Get existing data
            newProject.id = this.id;
            if (!newProject.dateDue) {
                newProject.dateDue = this.projectService.getProjectById(newProject.id).dateDue;
            }

            // Update the project
            this.projectService.updateProject(newProject).then(() => {
                this.router.navigate(['..'], { relativeTo: this.route });
            });

            return;
        }

        newProject.id = -1 + '';
        newProject.manager = this.afa.auth.currentUser.uid;
        newProject.dateCreated = Date.now();
        newProject.dateCompleted = null;

        // Add the document
        this.projectService.addProject(newProject);
        this.router.navigate(['..'], { relativeTo: this.route });
    }

    // Navigate up one level
    onCancel() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }

    getForm() {
        return this.projectForm;
    }

    getSubmitButtonText(): string {
        if (this.editMode) {
            return 'Update Project';
        } else {
            return 'Create Project';
        }
    }

    isCompletedDisabled(): boolean {
        return this.completedDisabled;
    }

    isCanceledDisabled(): boolean {
        return this.canceledDisabled;
    }

    isFormInvalid(): boolean {
        if (this.submitAttempted) {
            this.projectForm.controls.name.markAsTouched();
            this.projectForm.controls.description.markAsTouched();
            this.projectForm.controls.dateDue.markAsTouched();
        }
        if (
            this.projectForm.get('name').touched &&
            this.projectForm.get('description').touched &&
            this.projectForm.get('dateDue').touched
        ) {
            return this.projectForm.invalid;
        }
    }
}
