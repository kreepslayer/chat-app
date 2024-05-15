import { Injectable } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { Socket } from 'ngx-socket-io';
import { Chat } from '../models/chat.interface';
import { User } from '../models/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { chatInSidebar } from '../models/chatInSidebar.interface';
import { Message } from '../models/message.interface';
import { ChatSocketService } from './chat-socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: CustomSocket,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private chatSocketService: ChatSocketService
  ) {}

  getChats(): Observable<Chat[]> {
    return this.socket.fromEvent('chats');
  }

  getChatsInSidebar(): Observable<chatInSidebar[]> {
    return this.socket.fromEvent('chatsInSidebar');
  }

  //TODO: refactor to create by 2 users
  createChat(chat: Chat) {
    //TODO: check if chat already exists
    this.socket.emit('createChat', chat);
    this.snackbar.open(`Chat ${chat.name} created`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  dropTable() {
    this.socket.emit('dropTable');
  }

  sendMessage(message: Message, socket: Socket) {
    this.socket.emit('sendMessage', message);
  }

  getMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }
}
