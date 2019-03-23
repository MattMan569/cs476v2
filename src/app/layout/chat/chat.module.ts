import { ChatComponent } from './chat.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatRoutingModule } from './chat-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, NgbModule, ReactiveFormsModule, ChatRoutingModule],
    declarations: [ChatComponent]
})
export class ChatModule {}
