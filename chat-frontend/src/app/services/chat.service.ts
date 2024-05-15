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

  dropTable() {
    this.socket.emit('dropTable');
  }

  sendMessage(message: string, chat: Chat) {
    const newMessage: Message = {
      message,
      chat,
    };
    this.socket.emit('sendMessage', newMessage);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  createChat(user: User) {
    this.socket.emit('createChat', user);
  }

  joinChat(userId: number) {
    this.socket.emit('joinChat', userId);
  }

  leaveChat() {
    this.socket.emit('leaveChat');
  }

  getChatMessages(): Observable<Message[]> {
    return this.socket.fromEvent<Message[]>('messages');
  }
}
