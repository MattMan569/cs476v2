import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-project-edit',
    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
    private projectForm: FormGroup;

    constructor() {}

    ngOnInit() {
        this.projectForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required),
            dueDate: new FormControl(null, Validators.required),
            status: new FormControl('inProgress', Validators.required),
            priority: new FormControl('normal', Validators.required)
        });

        NgbDatepicker.prototype.focus = function() {
            this._elementRef.nativeElement.focus();
        };
    }

    onSubmit() {
        console.log(this.projectForm);
    }

    getForm() {
        return this.projectForm;
    }
}
