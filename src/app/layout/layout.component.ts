import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { MessageServiceFactory } from '../shared';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    private servicesLoaded: Promise<boolean>;
    private afaSub: Subscription;
    private afsSub: Subscription;

    collapedSideBar: boolean;

    constructor(private afa: AngularFireAuth, private afs: AngularFirestore) {}

    ngOnInit() {
        // const x = MessageServiceFactory.CreateMessageService('System Message', this.afa, this.afs);
        // MessageServiceFactory.CreateMessageService('User Message', this.afa, this.afs).getUserMessagesByRecipientId('a');
        // MessageServiceFactory.CreateMessageService('User Message', this.afa, this.afs).sendMessage('hello');
        // MessageServiceFactory.CreateMessageService('System Message', this.afa, this.afs).sendMessage('hello');

        // Wait until the connection to the database services is established
        // before rendering the view.
        this.afaSub = this.afa.idToken.subscribe(() => {
            this.afaSub = this.afs
                .collection('projects')
                .valueChanges()
                .subscribe(() => {
                    this.servicesLoaded = Promise.resolve(true);
                    if (this.afaSub) {
                        this.afaSub.unsubscribe();
                    }
                    if (this.afsSub) {
                        this.afsSub.unsubscribe();
                    }
                });
        });
    }

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }

    isServicesLoaded(): Promise<boolean> {
        return this.servicesLoaded;
    }
}
