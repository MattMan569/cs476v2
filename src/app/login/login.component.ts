import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { NgForm } from '@angular/forms';
import { AuthService } from '../shared';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit() {}

    onLogIn(form: NgForm) {
        const email = form.value.email;
        const password = form.value.password;
        this.authService.logInUser(email, password);
    }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
    }
}
