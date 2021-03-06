import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'projects', pathMatch: 'full' },
            { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule' },
            { path: 'chat', loadChildren: './chat/chat.module#ChatModule' },
            { path: 'inbox', loadChildren: './messages/messages.module#MessagesModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
