import { Component } from '@angular/core';
import { CurrentUserService } from '../../services/currentUser.service';
import { User } from '../../models/user.interface';
import { Chat } from '../../models/chat.interface';
import { Message } from '../../models/message.interface';
import { chatInSidebar } from '../../models/chatInSidebar.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  //animations
  isExpanded: boolean = false;
  state: string = 'initial';

  expand() {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'expanded' : 'initial';
  }

  // messages: Message[] = [];
  // chats: Chat[] = []; //! Из сервиса
  activeChat: Chat = {
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
  constructor(public currentUserService: CurrentUserService) {}
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
  ngOnInit() {
    this.currentUser = this.currentUserService.getCurrentUser();
    this.chatsInSidebar = this.currentUserService.getChatsInSidebar();
    console.log(
      '🚀 ~ MainComponent ~ ngOnInit ~ this.currentUser:',
      this.currentUser
    );
  }
}
