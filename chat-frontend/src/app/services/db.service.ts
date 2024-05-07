import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { tokenGetter } from '../app.module';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor() {}
  socket = io('http://localhost:3000/chats', {
    auth: {
      Authorization: tokenGetter(),
    },
  });

  public sendMessage() {
    this.socket.emit('message', 'hello');
  }
}
