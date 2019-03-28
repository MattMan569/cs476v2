import { Component, OnInit } from '@angular/core';
import { MessageServiceFactory, PrivateMessage } from 'src/app/shared';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
    private messages: PrivateMessage[] = [];

    constructor(private afa: AngularFireAuth, private afs: AngularFirestore) {}

    ngOnInit() {
        // Get this user's messages
        MessageServiceFactory.CreateMessageService('User Message', this.afa, this.afs)
            .getAllMessagesByRecipientId(this.afa.auth.currentUser.uid)
            .then((messages: PrivateMessage[]) => {
                this.messages = messages;
            });
    }

    getMessages(): PrivateMessage[] {
        return this.messages;
    }
}
