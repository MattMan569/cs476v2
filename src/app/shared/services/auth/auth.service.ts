import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;

    constructor(private router: Router) {}

    logInUser(email: string, password: string) {
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
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    }
}
