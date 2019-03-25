import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { MessageComposeComponent } from './message-compose/message-compose.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';

const routes: Routes = [
    {
        path: '',
        component: MessagesComponent,
        children: [
            { path: '', component: MessageListComponent }, // Message list
            { path: 'compose', component: MessageComposeComponent }, // Create new message
            { path: ':mid', component: MessageDetailComponent } // View message
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagesRoutingModule {}
