import { AuthService } from '../../services/auth.service';
import { Chat } from '../../models/chat.interface';
import { chatInSidebar } from '../../models/chatInSidebar.interface';
// import { ChatsService } from '../../services/chats.service';
// import { CurrentUserService } from '../../services/currentUser.service';
// import { DbService } from '../../services/db.service';
import { map } from 'rxjs/operators';
import { Message } from '../../models/message.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { Component, type OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor() {}
  //animations
  isExpanded: boolean = false;
  state: string = 'initial';
  expand() {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'expanded' : 'initial';
  }

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
    password: '',
  };
  chatsInSidebar: chatInSidebar[] = [
    {
      userName: '',
      lastMessageText: '',
      notifications: 0,
    },
  ];
}
