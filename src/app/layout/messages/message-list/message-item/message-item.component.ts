import { Component, OnInit, Input } from '@angular/core';
import { PrivateMessage, UserService } from 'src/app/shared';

@Component({
    selector: 'app-message-item',
    templateUrl: './message-item.component.html',
    styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {
    @Input() private message: PrivateMessage;

    constructor(private userService: UserService) {}

    ngOnInit() {}

    getMessage(): PrivateMessage {
        return this.message;
    }

    getSender(): string {
        if (this.message.senderId === 'SYSTEM') {
            return this.message.senderId;
        } else {
            return this.userService.getUserById(this.message.senderId).displayName;
        }
    }
}
