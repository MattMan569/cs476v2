import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // User's session ID token
    private token: string;

    constructor(private router: Router) {}

    // Sign a user up with an email and password
    signUpUser(email: string, password: string) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => console.log(error));
    }

    // Sign a user in with email and password
    signInUser(email: string, password: string) {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                this.router.navigate(['/dashboard']);

                firebase
                    .auth()
                    .currentUser.getIdToken()
                    .then((token: string) => {
                        this.token = token;
                        localStorage.setItem('isSignedIn', 'true');
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    }

    // Sign a user out
    signOutUser() {
        firebase.auth().signOut();
        this.token = null;
    }

    // Is user signed in?
    isUserAuthenticated() {
        return this.token != null;
    }

    // Get the session ID token
    getToken() {
        return this.token;
    }
}
