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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  avatarURL = '/none';
  displayName: string = '';

  register(
    userName: string,
    password: string,
    displayName: string = userName,
    avatarURL: string = '/none'
  ) {
    this.displayName = userName;
    return this.http
      .post<any>('/api/users/register', {
        userName,
        password,
        displayName,
        avatarURL,
      })
      .pipe(
        map(({ access_token }) => {
          localStorage.setItem('token', access_token);
          return access_token;
        })
      );
  }

  login(userName: string, password: string) {
    this.displayName = userName;
    this.avatarURL = '/none';
    return this.http
      .post<any>(`/api/users/login`, {
        userName,
        password,
      })
      .subscribe((data) => {
        console.log(data);
        console.log(data.success);
        localStorage.setItem('token', data.access_token);
      });
  }
}
