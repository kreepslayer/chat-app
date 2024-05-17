import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from './models/newUser.model';

import { AuthService } from './services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
    @ViewChild('form') form: NgForm;

    submissionType: 'login' | 'join' = 'login';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        const { userName, password } = this.form.value;
        if (!userName || !password) return;

        console.log(userName, password);

        if (this.submissionType === 'login') {
            console.log('login');
            return this.authService.login(userName, password).subscribe(() => {
                this.router.navigateByUrl('/home');
            });
        } else if (this.submissionType === 'join') {
            const { userName } = this.form.value;
            if (!userName) return;

            const newUser: NewUser = { userName, password };

            console.log('join');

            return this.authService.register(newUser).subscribe(() => {
                this.toggleText();
            });
        }
    }

    toggleText() {
        if (this.submissionType === 'login') {
            this.submissionType = 'join';
        } else if (this.submissionType === 'join') {
            this.submissionType = 'login';
        }
    }
}
