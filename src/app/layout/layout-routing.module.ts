import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule' },
            { path: 'chat', loadChildren: './chat/chat.module#ChatModule' },
            { path: 'inbox', loadChildren: './messages/messages.module#MessagesModule' },
            { path: 'calendar', loadChildren: './calendar/calendar.module#CalendarModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
