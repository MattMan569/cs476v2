import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService, PrivateMessage, MessageServiceFactory } from 'src/app/shared';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-message-detail',
    templateUrl: './message-detail.component.html',
    styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit {
    private message: PrivateMessage;

    constructor(
        private afa: AngularFireAuth,
        private afs: AngularFirestore,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            // Get the specific message
            MessageServiceFactory.CreateMessageService('User Message', this.afa, this.afs)
                .getAllMessagesByRecipientId(this.afa.auth.currentUser.uid)
                .then((messages: PrivateMessage[]) => {
                    messages.forEach((message: PrivateMessage) => {
                        if (message.id === params.mid) {
                            this.message = message;
                        }
                    });
                });
        });
    }

    getMessage(): PrivateMessage {
        return this.message;
    }

    getUser(uid: string): string {
        if (uid === 'SYSTEM') {
            return uid;
        } else {
            return this.userService.getUserById(uid).displayName;
        }
    }
}
