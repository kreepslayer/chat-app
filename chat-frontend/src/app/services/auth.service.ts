import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CurrentUserService } from './currentUser.service';
import type { Chat } from '../models/chat.interface';
export interface loginForm {
  userName: string;
  password: string;
}
export interface User {
  userName: string;
  password: string;
  passwordConfirm: string;
  displayName: string;
  avatarURL: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private currentUserService: CurrentUserService
  ) {}
  avatarURL = '/none';
  displayName: string = '';

  register(user: User) {
    user.displayName = user.userName;
    user.avatarURL = '/none';
    console.log(`registering user ${JSON.stringify(user)}`);
    return this.http.post<any>('/api/users/register', user).pipe(
      map((data) => {
        console.log(`data --> ${JSON.stringify(data)}`);
        console.log('🚀 ~ AuthService ~ map ~ data.FullUser:', data.FullUser);
        this.currentUserService.currentUser = data.FullUser;
      })
      // map(({ access_token }) => {
      //   localStorage.setItem('token', access_token);
      //   return access_token;
      // })
    );
  }

  login(loginForm: loginForm) {
    this.displayName = loginForm.userName;
    this.avatarURL = '/none';
    return this.http
      .post<any>(`/api/users/login`, {
        userName: loginForm.userName,
        password: loginForm.password,
      })
      .pipe(
        map((data) => {
          console.log(`data -> ${JSON.stringify(data)}`);
          console.log(`data.success -> ${data.success}`);
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('userName', data.FullUser.userName);
          this.currentUserService.currentUser = data.FullUser;
          console.log(
            '🚀 ~ AuthService ~ map ~ this.currentUserService.currentUser(from authService):',
            this.currentUserService.currentUser
          );
        })
      );
  }
}
