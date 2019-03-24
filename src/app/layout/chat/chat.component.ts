import { Component, OnInit } from '@angular/core';
import { ChatService, ChatMessage, UserService, User } from 'src/app/shared/';
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

    constructor(private chatService: ChatService, private userService: UserService, private afa: AngularFireAuth) {}

    ngOnInit() {
        this.chatMessages = this.chatService.getMessages();
        this.chatService.getNewMessages().subscribe((chatMessages: ChatMessage[]) => {
            this.chatMessages = chatMessages;
        });

        this.chatForm = new FormGroup({
            message: new FormControl(null, Validators.required)
        });
    }

    onSubmit() {
        if (!this.chatForm.valid) {
            return;
        }
        const newChatMessage: ChatMessage = this.chatForm.value;

        newChatMessage.senderId = this.afa.auth.currentUser.uid;
        newChatMessage.dateSent = Date.now();

        this.chatService.sendChat(newChatMessage);
        this.chatForm.reset();
    }

    getForm() {
        return this.chatForm;
    }

    getChatMessages(): ChatMessage[] {
        return this.chatMessages;
    }

    getDisplayName(uid: string): string {
        return this.userService.getUserById(uid).displayName;
    }

    getClass(message: ChatMessage): string {
        if (message.senderId === this.afa.auth.currentUser.uid) {
            return 'bg-primary text-white ml-auto';
        } else {
            return 'bg-success text-white';
        }
    }

    getDateSent(message: ChatMessage): string {
        let date = '';
        date += new Date(message.dateSent).getMonth();
        date += '/';
        date += new Date(message.dateSent).getDate();
        date += '/';
        date += new Date(message.dateSent).getFullYear();
        date += ' ';
        date += new Date(message.dateSent).getHours() % 12;
        date += ':';
        date += new Date(message.dateSent).getMinutes();
        date += ':';
        date += new Date(message.dateSent).getSeconds();
        date += '\u00A0'; // nbsp
        date += new Date(message.dateSent).getHours() >= 12 ? 'PM' : 'AM';

        return date;
    }
}
