import { Injectable } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { Socket } from 'ngx-socket-io';
import { Chat } from '../models/chat.interface';
import { User } from '../models/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { chatInSidebar } from '../models/chatInSidebar.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  constructor(
    private socket: CustomSocket,
    private snackbar: MatSnackBar,
    private http: HttpClient
  ) {}
}
