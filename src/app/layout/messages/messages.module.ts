import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessageComposeComponent } from './message-compose/message-compose.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageItemComponent } from './message-list/message-item/message-item.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [MessagesComponent, MessageComposeComponent, MessageListComponent, MessageItemComponent, MessageDetailComponent],
    imports: [CommonModule, ReactiveFormsModule, MessagesRoutingModule]
})
export class MessagesModule {}
