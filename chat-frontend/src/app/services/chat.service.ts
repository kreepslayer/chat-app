import { Injectable } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { Socket } from 'ngx-socket-io';
import { Chat } from '../models/chat.interface';
import { User } from '../models/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { chatInSidebar } from '../models/chatInSidebar.interface';

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
    return this.socket.fromEvent('chats');
  }

  getChatsInSidebar(): Observable<chatInSidebar[]> {
    return this.socket.fromEvent('chats').pipe(
      map((chats: any) => {
        const sideBarChats: chatInSidebar[] = [];
        for (let index = 0; index < chats.length; index++) {
          let thisUsers = chats[index].users;
          let thisUser = thisUsers[0];
          if (thisUsers[0].userName === localStorage.getItem('userName')) {
            if (thisUsers[1] !== undefined) {
              thisUser.userName = thisUsers[1].userName;
            } else {
              thisUser.userName = 'error in chat creating';
            }
          }
          sideBarChats.push({
            userName: thisUser.userName,
            lastMessageText: 'test message',
          });
        }
        return sideBarChats;
      })
    );
  }

  createChat(chat: Chat) {
    // const userChats: Chat[] = [];

    // this.getChats().subscribe((data) => {
    //   userChats.push(...data);
    // });

    // console.log('userChats-->');

    // console.log(userChats);

    // for (let index = 0; index < userChats.length; index++) {
    //   if (userChats[index].name === chat.name) {
    //     this.snackbar.open(`Chat ${chat.name} already exists`, 'Close', {
    //       duration: 2000,
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //     });
    //     return;
    //   }
    //   const users = userChats[index].users;
    //   if (users && chat.users) {
    //     for (let index2 = 0; index2 < users.length; index2++) {
    //       if (users[index2].userName === chat.users[0].userName) {
    //         this.snackbar.open(`Chat ${chat.name} already exists`, 'Close', {
    //           duration: 2000,
    //           horizontalPosition: 'right',
    //           verticalPosition: 'top',
    //         });
    //         return;
    //       }
    //     }
    //   }
    // }
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
}
