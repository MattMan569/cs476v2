import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Project, ProjectService } from 'src/app/shared';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-project-edit',
    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
    private projectForm: FormGroup;
    private projectsCollection: AngularFirestoreCollection<Project>;

    constructor(
        private afs: AngularFirestore,
        private afa: AngularFireAuth,
        private projectService: ProjectService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // Setup the form
        this.projectForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required),
            dateDue: new FormControl(null, Validators.required),
            status: new FormControl('In Progress', Validators.required),
            priority: new FormControl('Normal', Validators.required)
        });

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

        newProject.id = -1 + '';
        newProject.manager = this.afa.auth.currentUser.uid;
        newProject.dateCreated = Date.now();
        newProject.dateCompleted = null;

        // Reference the project collection
        this.projectsCollection = this.afs.collection('projects');

        // Add the document
        this.projectService.addProject(newProject);
        // this.projectsCollection.add(newProject).then(ref => {
        //     // Change the id field to the document id
        //     ref.update({ id: ref.id });
        // });
    }

    // Navigate up one level
    onCancel() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }

    getForm() {
        return this.projectForm;
    }
}
