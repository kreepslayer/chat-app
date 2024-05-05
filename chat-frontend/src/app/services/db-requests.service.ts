import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.interface';
import { CurrentUserService } from './currentUser.service';
import type { Chat } from '../models/chat.interface';
@Injectable({
  providedIn: 'root',
})
export class DbRequestsService {
  constructor(
    private http: HttpClient,
    public currentUserService: CurrentUserService
  ) {}

  currentUser = this.currentUserService.getCurrentUser();

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(
      `http://localhost:3000/messages?username=:${this.currentUser.userName}`
    );
  }

  addMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(
      `http://localhost:3000/messages?userName=:${this.currentUser.userName}`,
      message
    );
  }

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(
      `http://localhost:3000/chats?userName=:${this.currentUser.userName}`
    );
  }

  addChat(chat: Chat): Observable<Chat> {
    return this.http.post<Chat>(
      `http://localhost:3000/chats?userName=:${this.currentUser.userName}`,
      chat
    );
  }
}
