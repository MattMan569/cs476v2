import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState: firebase.User;

    constructor(private afa: AngularFireAuth, private router: Router) {}

    // Sign a user up with an email and password
    signUpUser(email: string, password: string) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => console.log(error));
    }

    // Sign a user in with email and password
    signInUser(email: string, password: string) {
        this.afa.auth
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                this.afa.auth
                    .signInWithEmailAndPassword(email, password)
                    .then(response => {
                        this.afa.auth.currentUser
                            .getIdToken()
                            .then((token: string) => {
                                localStorage.setItem('userIdToken', token);
                                this.afa.authState.subscribe(auth => {
                                    this.authState = auth;
                                    console.log(this.authState);
                                });
                                this.router.navigate(['/dashboard']);
                            })
                            .catch(error => console.log(error));
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
            })
            .catch(error => console.log(error));
        this.router.navigate(['/login']);
    }
}
