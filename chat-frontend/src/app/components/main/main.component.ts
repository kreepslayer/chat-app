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
    let usersOfFind: User[] = [];
    console.log('findUser');
    let searchInput: HTMLInputElement | null =
      document.querySelector('#search');
    let searchIcon: HTMLInputElement | null =
      document.querySelector('#searchIcon');
    const text = searchInput?.value;
    console.log(`text = ${text}`);
    console.log('res -->');
    console.log(this.userService.findByUserName(text ? text : 'none'));
    this.userService.findByUserName(text ? text : 'none').pipe(
      map((data) => {
        usersOfFind = data;
      })
    );
    console.log(
      '🚀 ~ MainComponent ~ searchIcon?.addEventListener ~ chatsOfFind:',
      usersOfFind
    );
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
    const modal: HTMLInputElement | null =
      document.querySelector('.body-new-chat');
    window.onclick = function (event) {
      console.log(event.target);
      if (event.target == modal) {
        if (modal) {
          const newChatForm: HTMLInputElement | null =
            document.querySelector('.new-chat-form');
          if (newChatForm) {
            newChatForm.style.display = 'none';
          }
        }
      }
    };
  }

  chats$: Observable<Chat[]> = this.chatService.getChats();

  showNewChatForm() {
    let newChatForm: HTMLInputElement | null =
      document.querySelector('.new-chat-form');
    if (newChatForm) {
      newChatForm.style.display = 'block';
    }
  }
  closeNewChatForm() {
    let newChatForm: HTMLInputElement | null =
      document.querySelector('.new-chat-form');
    if (newChatForm) {
      newChatForm.style.display = 'none';
    }
  }
}
