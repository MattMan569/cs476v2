import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project, User } from 'src/app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
    private projectsCollection: AngularFirestoreCollection<Project>;
    private projectsSubscription: Subscription;
    private projects: Project[];

    constructor(private afs: AngularFirestore, private userService: UserService) {}

    ngOnInit(): void {
        this.projectsCollection = this.afs.collection('projects', ref => {
            return ref.orderBy('dateCreated', 'desc').limit(20);
        });
        this.projectsSubscription = this.projectsCollection.valueChanges().subscribe((projects: Project[]) => {
            this.projects = projects;
        });
    }

    getProjects(): Project[] {
        return this.projects;
    }

    getProjectManager(manager: string): User {
        return this.userService.getUserById(manager);
    }

    ngOnDestroy(): void {
        this.projectsSubscription.unsubscribe();
    }
}
