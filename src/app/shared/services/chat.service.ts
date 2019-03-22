import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ChatMessage } from '../interfaces';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private chatCollection: AngularFirestoreCollection<ChatMessage>;
    private messages: ChatMessage[];
    private newMessages = new Subject<ChatMessage[]>();

    constructor(private afs: AngularFirestore) {
        this.chatCollection = this.afs.collection('chat');
        this.chatCollection.valueChanges().subscribe((messages: ChatMessage[]) => {
            this.messages = messages;
            this.newMessages.next(this.messages.slice());
        });
    }

    getMessages(): ChatMessage[] {
        return this.messages;
    }

    getNewMessages(): Subject<ChatMessage[]> {
        return this.newMessages;
    }

    sendChat(chatMessage: ChatMessage): void {
        this.chatCollection.add(chatMessage).then(ref => {
            ref.update({ id: ref.id });
        });
    }

    run(): void {}
}
