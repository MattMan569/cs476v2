import { ChatComponent } from './chat.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
    imports: [CommonModule, NgbModule, ChatRoutingModule],
    declarations: [ChatComponent]
})
export class ChatModule {}
