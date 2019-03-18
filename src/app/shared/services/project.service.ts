import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Subject } from 'rxjs';
import { Project } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ProjectService implements OnInit {
    private projectsCollection: AngularFirestoreCollection<Project>;
    private projects: Project[];
    private projectsChanged = new Subject<Project[]>();

    constructor(private afs: AngularFirestore) {}

    ngOnInit(): void {
        this.projectsCollection = this.afs.collection('projects', ref => {
            return ref.orderBy('dateCreated', 'desc').limit(20);
        });
        this.projectsCollection.valueChanges().subscribe((projects: Project[]) => {
            this.projects = projects;
            this.projectsChanged.next(this.projects.slice());
        });
    }

    getProjects(): Project[] {
        return this.projects;
    }

    addProject(project: Project): void {
        this.afs
            .collection('projects')
            .add(project)
            .then(ref => {
                ref.update({ id: ref.id });
            });
    }

    getProjectsSubject(): Subject<Project[]> {
        return this.projectsChanged;
    }
}
