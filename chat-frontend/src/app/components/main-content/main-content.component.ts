import { ActiveChat } from '../../models/activeChat.interface';
import { animate, style, trigger } from '@angular/animations';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CurrentUserService } from '../../services/currentUser.service';
import { Router } from '@angular/router';
import { transition } from '@angular/animations';
import { Message } from '../../models/message.interface';
import { Chat } from '../../models/chat.interface';
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate(
          '0.15s ease-in',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate(
          '0.15s ease-out',
          style({ opacity: 0, transform: 'translateY(100%)' })
        ),
      ]),
    ]),
  ],
})
export class MainContentComponent {
  @Input() chats: Chat[] = [];
  sendMessage() {
    console.log(this.CurrentUserService.getCurrentUser());
    let messageSending: Message = {
      text: this.messageToSend,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
      sender: this.CurrentUserService.getCurrentUser(),
    };

    this.activeChat.messages.push(messageSending);
    this.messageToSend = '';

    // add to service
    setTimeout(() => {
      let main = document.querySelector('.main-main');
      let last: HTMLElement | null = document.querySelector('#endOFChat');
      console.log('🚀 ~ MainContentComponent ~ ngOnInit ~ last:', last);
      console.log('🚀 ~ MainContentComponent ~ ngOnInit ~ main:', main);
      if (last && main) {
        document.querySelector('#endOFChat')?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 100);
  }
  focus() {
    let searchInput: HTMLInputElement | null =
      document.querySelector('#message');
    let searchPar = searchInput?.parentElement;
    if (searchInput) {
      searchPar?.classList.add('activeSearch');
    }
  }
  focusout() {
    let searchInput: HTMLInputElement | null =
      document.querySelector('#message');
    let searchPar = searchInput?.parentElement;
    if (searchInput) {
      searchPar?.classList.remove('activeSearch');
    }
  }

  constructor(
    private router: Router,
    private CurrentUserService: CurrentUserService
  ) {}
  messageToSend: string = ``;
  ngOnInit() {
    setTimeout(() => {
      let main = document.querySelector('.main-main');
      let last: HTMLElement | null = document.querySelector('#endOFChat');
      if (last && main) {
        document.querySelector('#endOFChat')?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 1000);
    console.log(`chats: ${this.chats}`);
  }
  activeChat: ActiveChat = {
    username: 'TestUser',
    messages: [
      {
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          password: 'TestUserPassword',
        },
      },
    ],
  };
}
