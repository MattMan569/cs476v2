import { Component, OnInit } from '@angular/core';
import { ChatService, ChatMessage } from 'src/app/shared/';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    private chatForm: FormGroup;
    private chatMessages: ChatMessage[] = [];

    constructor(private chatService: ChatService, private afa: AngularFireAuth) {}

    ngOnInit() {
        this.chatMessages = this.chatService.getMessages();
        this.chatService.getNewMessages().subscribe((chatMessages: ChatMessage[]) => {
            this.chatMessages = chatMessages;
            console.log(this.chatMessages);
        });

        this.chatForm = new FormGroup({
            message: new FormControl(null, Validators.required)
        });
    }

    onSubmit() {
        const newChatMessage: ChatMessage = this.chatForm.value;

        newChatMessage.senderId = this.afa.auth.currentUser.uid;
        newChatMessage.dateSent = Date.now();

        this.chatService.sendChat(newChatMessage);
    }

    getForm() {
        return this.chatForm;
    }

    getChatMessages(): ChatMessage[] {
        return this.chatMessages;
    }
}
