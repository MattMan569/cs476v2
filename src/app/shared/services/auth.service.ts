import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState: firebase.User;

    constructor(private afa: AngularFireAuth, private router: Router) {}

    // Sign a user up with an email and password
    signUpUser(email: string, password: string, displayName: string) {
        this.afa.auth
            .createUserWithEmailAndPassword(email, password)
            .then(user => {
                user.user.updateProfile({ displayName: displayName });
            })
            .catch(error => console.log(error));
        // firebase
        //     .auth()
        //     .createUserWithEmailAndPassword(email, password)
        //     // .then(user => {
        //     //     return user.user.updateProfile({ displayName: displayName });
        //     // })
        //     .catch(error => console.log(error));
    }

    // Sign a user in with email and password
    signInUser(email: string, password: string) {
        this.afa.auth
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                this.afa.auth
                    .signInWithEmailAndPassword(email, password)
                    .then(response => {
                        this.afa.authState.subscribe(auth => {
                            this.afa.auth.currentUser
                                .getIdToken()
                                .then((token: string) => {
                                    localStorage.setItem('userIdToken', token);
                                    this.router.navigate(['/projects']);
                                })
                                .catch(error => console.log(error));
                        });
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    }

    // Sign a user out
    signOutUser() {
        this.afa.auth
            .signOut()
            .then(() => {
                localStorage.removeItem('userIdToken');
                this.router.navigate(['/login']);
            })
            .catch(error => console.log(error));
    }

    // Get the current user
    getCurrentUser(): firebase.User {
        return this.afa.auth.currentUser;
    }
}
