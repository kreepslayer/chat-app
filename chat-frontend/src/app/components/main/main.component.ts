import { Component, type OnInit } from '@angular/core';
import { CurrentUserService } from '../../services/currentUser.service';
import { User } from '../../models/user.interface';
import { Chat } from '../../models/chat.interface';
import { Message } from '../../models/message.interface';
import { chatInSidebar } from '../../models/chatInSidebar.interface';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatsService } from '../../services/chats.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(
    private currentUserService: CurrentUserService,
    private chatsService: ChatsService
  ) {}
  //animations
  isExpanded: boolean = false;
  state: string = 'initial';
  ngOnInit() {
    this.currentUser = this.currentUserService.getCurrentUser();
    this.chatsInSidebar = this.currentUserService.getChatsInSidebar();
    // this.chatsService
    //   .getChatsForUser(this.currentUser.userName)
    //   .subscribe((chats: Chat[]) => {
    //     //  'chats' - массив объектов Chat
    //     console.log(typeof chats);
    //     console.log(chats.length); //  length
    //     console.log(chats); // весь массив
    //     this.chats = chats;
    //   });
    this.chats = this.chatsService.getChats(this.currentUser.userName);
  }
  expand() {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'expanded' : 'initial';
  }

  // messages: Message[] = [];
  // chats: Chat[] = []; //! Из сервиса //! done

  chats: Chat[] = [];
  allUsers: User[] = [];
  activeChat: Chat = {
    User1Name: '',
    User2Name: '',
    Messages: [],
  };
  focus() {
    let searchInput: HTMLInputElement | null =
      document.querySelector('#search');
    let searchPar = searchInput?.parentElement;
    if (searchInput) {
      searchPar?.classList.add('activeSearch');
    }
  }
  focusout() {
    let searchInput: HTMLInputElement | null =
      document.querySelector('#search');
    let searchPar = searchInput?.parentElement;
    if (searchInput) {
      searchPar?.classList.remove('activeSearch');
    }
  }
  currentUser: User = {
    id: 0,
    userName: '',
    displayName: '',
    avatarURL: '',
    role: '',
  };
  chatsInSidebar: chatInSidebar[] = [
    {
      username: '',
      lastMessageText: '',
      notifications: 0,
    },
  ];
}
