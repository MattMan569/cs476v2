import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersCollection: AngularFirestoreCollection<User>;
    private users: User[];
    private usersChanged = new Subject<User[]>();

    constructor(private afs: AngularFirestore) {
        this.usersCollection = this.afs.collection('users');
        this.usersCollection.valueChanges().subscribe((users: User[]) => {
            this.users = users;
            this.usersChanged.next(this.users.slice());
        });
    }

    getUsers(): User[] {
        return this.users;
    }

    getUserById(uid: string): User {
        for (const user of this.users) {
            if (user.uid === uid) {
                return user;
            }
        }
    }

    getUsersSubject(): Subject<User[]> {
        return this.usersChanged;
    }

    run(): void {}
}
