import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { Chat } from '../models/chat.interface';
import { Message } from '../models/message.interface';
import { chatInSidebar } from '../models/chatInSidebar.interface';
import { map } from 'rxjs';
import { ChatsService } from './chats.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  constructor(private chatsService: ChatsService, private http: HttpClient) {}

  public ChatsInSidebar: chatInSidebar[] = [];

  public justChats: Chat[] = [];

  getChatsInSidebar() {
    console.log(
      `Current user from CurrentUserService: ${JSON.stringify(
        this.currentUser
      )}`
    );

    //----------------------------------------------------------------------------

    // get all chats
    this.justChats = this.chatsService.getChats(this.getCurrentUser().userName);
    console.log(`justChats: ${JSON.stringify(this.justChats)}`);

    if (this.justChats != null || this.justChats != undefined) {
      for (let index = 0; index < this.justChats.length; index++) {
        let chat = this.justChats[index];
        let correctUserName: string;
        if (this.currentUser.userName === chat.User1Name) {
          correctUserName = chat.User2Name;
        } else {
          correctUserName = chat.User1Name;
        }

        console.log(`all messages before parse`);

        console.log(chat.Messages);

        //get last message
        for (let i = 0; i < chat.Messages.length; i++) {
          chat.Messages[i] = JSON.parse(chat.Messages[i] as unknown as string);
          console.log(`message${i}: ${chat.Messages[i]}`);

          console.log(chat.Messages[i]);
        }

        console.log(`all messages after parse`);
        console.log(chat.Messages);

        this.ChatsInSidebar.push({
          username: correctUserName,
          lastMessageText: chat.Messages[chat.Messages.length - 1].text,
          notifications: 0,
        });
      }
      return this.ChatsInSidebar;
    } else {
      console.log(`no chats`);
      return this.ChatsInSidebar;
    }
    //make chatInSidebar from justChats
  }

  setChatsInSidebar(chatsInSidebar: chatInSidebar[]) {
    this.ChatsInSidebar = chatsInSidebar;
  }

  addChatInSidebar(chatInSidebar: chatInSidebar) {
    this.ChatsInSidebar.push(chatInSidebar);
  }
  public currentUser: User = {
    id: 0,
    userName: '',
    password: '',
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
      password: '',
    };
  }
}
