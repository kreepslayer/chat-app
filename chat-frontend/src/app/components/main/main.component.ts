import { AuthService } from '../../services/auth.service';
import { Chat } from '../../models/chat.interface';
import { chatInSidebar } from '../../models/chatInSidebar.interface';
import { map } from 'rxjs/operators';
import { Message } from '../../models/message.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { Component, type OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}
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
  findUser() {
    console.log('findUser');
    let searchInput: HTMLInputElement | null =
      document.querySelector('#search');
    let searchIcon: HTMLInputElement | null =
      document.querySelector('#searchIcon');
    searchIcon?.addEventListener('click', (e) => {
      const text = searchInput?.value;
      console.log(text);
      this.chatService.getChatsByTwoUsers(text ? text : 'none', 'admin');
    });
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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.chatService.createChat({
      id: 322,
      name: 'TestChat',
      users: [
        {
          id: 15,
          password: 'test1',
          userName: 'test1',
        },
        {
          id: 16,
          password: 'test2',
          userName: 'test2',
        },
      ],
    });
  }

  chats$: Observable<Chat[]> = this.chatService.getChats();
}
