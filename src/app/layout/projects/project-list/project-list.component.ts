import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project, User, projectFilter } from 'src/app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
    private projectsCollection: AngularFirestoreCollection<Project>;
    private projectsSubscription: Subscription;
    private projects: Project[];
    filter: projectFilter = 'All Projects';
    filters: projectFilter[] = ['All Projects', 'My Projects', 'Other Projects'];

    constructor(private afs: AngularFirestore, private afa: AngularFireAuth, private userService: UserService) {}

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

    getFilters() {
        return this.filters;
    }

    isDisplayed(project: Project): boolean {
        if (this.filter === 'All Projects') {
            return true;
        } else if (this.filter === 'My Projects') {
            if (this.afa.auth.currentUser.uid === project.manager) {
                return true;
            } else {
                return false;
            }
        } else if (this.filter === 'Other Projects') {
            if (this.afa.auth.currentUser.uid === project.manager) {
                return false;
            } else {
                return true;
            }
        }
    }

    ngOnDestroy(): void {
        this.projectsSubscription.unsubscribe();
    }
}
