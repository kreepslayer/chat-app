import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { Chat } from '../models/chat.interface';
@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  constructor() {}

  public Chats: Chat[] = [];
  getChats() {
    return this.Chats;
  }
  addChat(chat: Chat) {
    this.Chats.push(chat);
  }
  setChats(chats: Chat[]) {
    this.Chats = chats;
  }

  public currentUser: User = {
    id: 0,
    userName: '',
    displayName: '',
    avatarURL: '',
    role: '',
  };

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  clearCurrentUser() {
    this.currentUser = {
      id: 0,
      userName: '',
      displayName: '',
      avatarURL: '',
      role: '',
    };
  }
}
