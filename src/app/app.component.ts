import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from '../environments/environment';
import { ProjectService } from './shared/services/project.service';
import { TaskService } from './shared/services/task.service';
import { UserService } from './shared/services/user.service';
import { ChatService } from './shared/services/chat.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private projectService: ProjectService,
        private taskService: TaskService,
        private userService: UserService,
        private chatService: ChatService
    ) {}

    ngOnInit() {
        if (!firebase) {
            firebase.initializeApp({
                apiKey: 'AIzaSyCDUgahdCOJSUonSV_96hP0o_uc91Lxau4',
                authDomain: 'cs-476-v2.firebaseapp.com',
                databaseURL: 'https://cs-476-v2.firebaseio.com',
                projectId: 'cs-476-v2',
                storageBucket: 'cs-476-v2.appspot.com',
                messagingSenderId: '911742570688'
            });
        }

        this.projectService.run();
        this.taskService.run();
        this.userService.run();
        this.chatService.run();
    }
}
