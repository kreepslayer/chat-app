import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  constructor(private authService: AuthService) {}
  register() {
    const passCheck: HTMLInputElement = document.querySelector(
      '#passCheck'
    ) as HTMLInputElement;
    console.log(passCheck.value, this.password);
    if (passCheck.value == this.password) {
      this.authService
        .register(this.username, this.password)
        .subscribe((data) => {
          console.log(data); // log server response
          console.log('no errors');
        });
    } else {
      alert('Passwords do not match');
      return;
    }
  }
  back() {
    window.history.back();
  }
}
