import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private authService: AuthService) {}
  username = '';
  password = '';
  login() {
    this.authService.login(this.username, this.password).subscribe((data) => {
      console.log(data); // log server response
    });
  }
}
