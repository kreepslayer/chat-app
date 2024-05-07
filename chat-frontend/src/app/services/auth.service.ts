import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { CurrentUserService } from './currentUser.service';
import { Chat } from '../models/chat.interface';
import { User } from '../models/user.interface';
import { Observable, throwError } from 'rxjs';
import { LoginResponse } from '../models/loginResponse.interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LOCAL_STORAGE_TOKEN } from '../app.module';
import { JwtHelperService } from '@auth0/angular-jwt';
export interface loginForm {
  userName: string;
  password: string;
}
export const snackBarConfig: MatSnackBarConfig = {
  duration: 3000,
  verticalPosition: 'top',
  horizontalPosition: 'right',
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private currentUserService: CurrentUserService,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService
  ) {}
  register(user: User): Observable<User> {
    console.log(`registering user ${JSON.stringify(user)}`);
    return this.http.post<User>('/api/users/register', user).pipe(
      tap((data: User) => {
        this.snackbar.open('Registration successful', 'Close', snackBarConfig);
      }),
      catchError((e) => {
        this.snackbar.open(`${e.error.message}`, 'Close', snackBarConfig);
        return throwError(e);
      })
    );
  }

  login(loginForm: loginForm): Observable<LoginResponse> {
    return this.http
      .post<any>(`/api/users/login`, {
        userName: loginForm.userName,
        password: loginForm.password,
      })
      .pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem(LOCAL_STORAGE_TOKEN, res.access_token);
        }),
        tap(() => {
          this.snackbar.open('Login successful', 'Close', snackBarConfig);
        }),
        catchError((e) => {
          this.snackbar.open(`${e.error.message}`, 'Close', snackBarConfig);
          return throwError(e);
        })
      );
  }

  getLoggedInUser() {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken;
  }
}
