import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.loginForm.value);
    this.authService
      .login(this.loginForm.value)
      .pipe()
      .subscribe((data) => {
        console.log(data);
        console.log('no errors');
        this.router.navigate(['/main']);
      });
    // .pipe(map( (token) => console.log(token) )); // TODO: redirect to main
  }
}
