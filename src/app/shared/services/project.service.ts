import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Subject } from 'rxjs';
import { Project } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private projectsCollection: AngularFirestoreCollection<Project>;
    private projects: Project[];
    private projectsChanged = new Subject<Project[]>();

    constructor(private afs: AngularFirestore) {
        this.projectsCollection = this.afs.collection('projects');
        this.projectsCollection.valueChanges().subscribe((projects: Project[]) => {
            this.projects = projects;
            this.projectsChanged.next(this.projects.slice());
        });
    }

    getProjects(): Project[] {
        return this.projects;
    }

    getProjectById(id: string): Project {
        for (const project of this.projects) {
            if (project.id === id) {
                return project;
            }
        }
    }

    addProject(project: Project): void {
        this.projectsCollection.add(project).then(ref => {
            ref.update({ id: ref.id });
        });
    }

    getProjectsSubject(): Subject<Project[]> {
        return this.projectsChanged;
    }

    run(): void {}
}
