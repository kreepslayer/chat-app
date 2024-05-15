import { AuthService } from '../../services/auth.service';
import { Chat } from '../../models/chat.interface';
import { chatInSidebar } from '../../models/chatInSidebar.interface';
import { map, tap } from 'rxjs/operators';
import { Message } from '../../models/message.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { Component, type OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  focusout() {
    let searchInput: HTMLInputElement | null =
      document.querySelector('#search');
    let searchPar = searchInput?.parentElement;
    if (searchInput) {
      searchPar?.classList.remove('activeSearch');
    }
  }

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
    this.chatService.getChats().subscribe((data) => {
      console.log(data);
    });
    this.chatService.getChatsInSidebar().subscribe((data) => {
      console.log(data);
    });
  }

  chats$: Observable<Chat[]> = this.chatService.getChats();

  chatsInSidebar$: Observable<chatInSidebar[]> =
    this.chatService.getChatsInSidebar();

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
  test() {
    this.chatService.dropTable();
  }

  newChatForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    chatName: new FormControl('none'),
  });

  onSubmit() {
    const chat: Chat = {};
    chat.users = [
      {
        userName: this.newChatForm.value.userName,
      },
    ];
    chat.name = this.newChatForm.value.chatName;
    this.chatService.createChat(chat);
    this.chats$ = this.chatService.getChats();
    this.chatsInSidebar$ = this.chatService.getChatsInSidebar();

    let newChatForm: HTMLInputElement | null =
      document.querySelector('.new-chat-form');
    if (newChatForm) {
      newChatForm.style.display = 'none';
    }
  }
}
