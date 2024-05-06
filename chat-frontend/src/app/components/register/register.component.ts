import { Component, type OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  type AbstractControl,
  type ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

class CustomValidators {
  static passwordContainsNumber(
    control: AbstractControl
  ): ValidationErrors | null {
    const regex = /\d/;
    if (regex.test(control.value) && control.value !== null) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }
  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirmPass = control.get('passwordConfirm')?.value;
    if (pass === confirmPass && pass !== null && confirmPass !== null) {
      return null;
    }
    return { passwordsMismatch: true };
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.fb.group(
    {
      userName: [null, [Validators.required, Validators.minLength(4)]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.passwordContainsNumber,
        ],
      ],
      passwordConfirm: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.passwordContainsNumber,
        ],
      ],
    },
    {
      validators: CustomValidators.passwordsMatch,
    }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.registerForm.value);
    this.authService
      .register(this.registerForm.value)
      .pipe()
      .subscribe((data) => {
        console.log(data);
        console.log('no errors');
        this.router.navigate(['/login']);
      });
  }
  //   this.authService
  //     .login(this.loginForm.value)
  //     .pipe()
  //     .subscribe((data) => {
  //       console.log(data);
  //       console.log('no errors');
  //       this.router.navigate(['/main']);
  //     });
  // }
  // register() {
  //   const passCheck: HTMLInputElement = document.querySelector(
  //     '#passCheck'
  //   ) as HTMLInputElement;
  //   console.log(passCheck.value, this.password);
  //   if (passCheck.value == this.password) {
  //     this.authService
  //       .register(this.username, this.password)
  //       .subscribe((data) => {
  //         console.log(data); // log server response
  //         console.log('no errors');
  //       });
  //   } else {
  //     alert('Passwords do not match');
  //     return;
  //   }
  // }
  back() {
    window.history.back();
  }
}
