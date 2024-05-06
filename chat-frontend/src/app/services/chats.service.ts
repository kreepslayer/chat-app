import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Chat } from '../models/chat.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(private http: HttpClient) {}

  chats: Chat[] = [];
  getChatsForUser(userName: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`/api/chats/${userName}`).pipe(
      map((chats) => {
        return chats;
      })
    );
  }
  getChats(username: string) {
    this.getChatsForUser(username).subscribe((chats) => {
      this.chats = chats;
    });
    return this.chats;
  }
}
