import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from 'src/app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
    private projectsCollection: AngularFirestoreCollection<Project>;
    private projectsObservable: Observable<Project[]>;
    private projectsSubscription: Subscription;
    private projects: Project[];

    constructor(private router: Router, private route: ActivatedRoute, private afs: AngularFirestore) {}

    ngOnInit(): void {
        this.projectsCollection = this.afs.collection('projects', ref => {
            return ref.orderBy('dateCreated', 'desc').limit(20);
        });
        this.projectsObservable = this.projectsCollection.valueChanges();
        this.projectsSubscription = this.projectsObservable.subscribe((projects: Project[]) => {
            this.projects = projects;
        });
    }

    getProjects(): Project[] {
        return this.projects;
    }

    ngOnDestroy(): void {
        this.projectsSubscription.unsubscribe();
    }
}
