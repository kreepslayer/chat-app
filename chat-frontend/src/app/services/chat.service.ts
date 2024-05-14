import { Injectable } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { Socket } from 'ngx-socket-io';
import { Chat } from '../models/chat.interface';
import { User } from '../models/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: CustomSocket,
    private snackbar: MatSnackBar,
    private http: HttpClient
  ) {}

  getMessages() {
    return this.socket.fromEvent('message');
  }

  getChats(): Observable<Chat[]> {
    return this.socket.fromEvent<Chat[]>('chats');
  }

  createChat(chat: Chat) {
    this.socket.emit('createChat', chat);
    this.snackbar.open(`Chat ${chat.name} created`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  getChatsByTwoUsers(user1Name: string, user2Name: string) {
    this.socket.emit('getChatsByTwoUsers', { user1Name, user2Name });
  }
}
