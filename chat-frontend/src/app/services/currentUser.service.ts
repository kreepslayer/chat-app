import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { Chat } from '../models/chat.interface';
import { Message } from '../models/message.interface';
import { chatInSidebar } from '../models/chatInSidebar.interface';
@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  constructor() {}

  public ChatsInSidebar: chatInSidebar[] = [
    {
      username: 'username',
      lastMessageText: 'message text',
      notifications: 5,
    },
  ];

  getChatsInSidebar() {
    return this.ChatsInSidebar;
  }

  setChatsInSidebar(chatsInSidebar: chatInSidebar[]) {
    this.ChatsInSidebar = chatsInSidebar;
  }

  addChatInSidebar(chatInSidebar: chatInSidebar) {
    this.ChatsInSidebar.push(chatInSidebar);
  }

  public Chats: Chat[] = [
    {
      User1: {
        id: 0,
        userName: '',
        displayName: '',
        avatarURL: '',
        role: '',
      },
      User2: {
        id: 0,
        userName: '',
        displayName: '',
        avatarURL: '',
        role: '',
      },
      Messages: [],
    },
  ];
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
