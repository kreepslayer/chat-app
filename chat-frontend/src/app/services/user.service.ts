import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Observable } from 'rxjs';
import type { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, snackbar: MatSnackBar) {}

  findByUserName(username: string): Observable<User[]> {
    return this.http.get<User[]>(
      `api/users/find-by-username?username=${username}`
    );
  }
}
