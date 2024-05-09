import { Injectable } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { Socket } from 'ngx-socket-io';
import type { Chat } from '../models/chat.interface';
import type { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket) {}

  getMessages() {
    return this.socket.fromEvent('message');
  }

  getChats() {
    return this.socket.fromEvent<Chat[]>('chats');
  }

  createChat() {
    const user2: User = {
      id: 4,
    };

    const chat: Chat = {
      name: 'testChat',
      users: [user2],
    };

    this.socket.emit('createChat', chat);
  }
}
