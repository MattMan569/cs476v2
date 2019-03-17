import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { NgForm } from '@angular/forms';
import { AuthService } from '../shared';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService, private afa: AngularFireAuth) {}

    ngOnInit() {
        if (localStorage.getItem('userIdToken')) {
            this.router.navigate(['/dashboard']);
        }
    }

    onLogIn(form: NgForm) {
        const email = form.value.email;
        const password = form.value.password;
        this.authService.signInUser(email, password);
    }
}
