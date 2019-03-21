import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

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
        this.afaSub = this.afa.idToken.subscribe((id: string) => {
            this.afaSub = this.afs
                .collection('projects')
                .valueChanges()
                .subscribe(data2 => {
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
