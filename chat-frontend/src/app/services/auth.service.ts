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
  signup(userName: string, password: string) {
    return this.http
      .post<any>('/api/users', {
        userName,
        password,
      })
      .pipe(
        map(({ token }) => {
          localStorage.setItem('token', token);
          return token;
        })
      );
  }

  login(userName: string, password: string) {
    return this.http.get<any>(`/api/users/${userName}/${password}`, {}).pipe(
      map(({ token }) => {
        localStorage.setItem('token', token);
        return token;
      })
    );
  }
}
