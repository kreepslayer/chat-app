import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { CurrentUserService } from '../../services/currentUser.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    public currentUserService: CurrentUserService
  ) {}
  currentUser = {
    id: 0,
    userName: '',
    displayName: '',
    avatarURL: '',
    role: '',
  };
  ngOnInit(): void {
    this.currentUser = this.currentUserService.getCurrentUser();
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.authService
      .login(this.loginForm.value)
      .pipe()
      .subscribe((data) => {
        console.log('no errors');
        this.router.navigate(['/main']);
      });
  }
}
