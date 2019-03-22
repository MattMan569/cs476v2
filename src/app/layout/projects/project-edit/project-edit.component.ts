import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from 'src/app/shared';
import { ProjectService } from 'src/app/shared/services/project.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-project-edit',
    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
    private projectForm: FormGroup;
    private id: string;
    private editMode = false;

    constructor(
        private afs: AngularFirestore,
        private afa: AngularFireAuth,
        private projectService: ProjectService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // Check if an existing form is being edited
        this.route.params.subscribe((params: Params) => {
            this.editMode = params.id != null;
            this.id = params.id;
        });

        if (this.editMode) {
            // Setup a prepopulated form
            const selectedProject = this.projectService.getProjectById(this.id);
            this.projectForm = new FormGroup({
                name: new FormControl(selectedProject.name, Validators.required),
                description: new FormControl(selectedProject.description, Validators.required),
                dateDue: new FormControl(selectedProject.dateDue, Validators.required),
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
        let newProject: Project;
        let formDate = '';

        // Get the form
        newProject = this.projectForm.value;

        // Format the date and get the timestamp
        formDate += this.projectForm.value.dateDue.year + '-';
        formDate += this.projectForm.value.dateDue.month + '-';
        formDate += this.projectForm.value.dateDue.day;
        newProject.dateDue = new Date(formDate).valueOf();

        if (this.editMode) {
            newProject.id = this.id;
            this.projectService.updateProject(newProject);
            return;
        }

        newProject.id = -1 + '';
        newProject.manager = this.afa.auth.currentUser.uid;
        newProject.dateCreated = Date.now();
        newProject.dateCompleted = null;

        // Add the document
        this.projectService.addProject(newProject);
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
}
