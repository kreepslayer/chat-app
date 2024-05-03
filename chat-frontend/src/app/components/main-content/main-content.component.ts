//@ts-nocheck
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveChat } from '../../models/activeChat.interface';
import { CurrentUserService } from '../../services/currentUser.service';
import { transition } from '@angular/animations';
import { trigger, style, animate } from '@angular/animations';

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
  sendMessage() {
    console.log(this.CurrentUserService.getCurrentUser());
    let messageSending: Message = {
      text: this.messageToSend,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
      sender: this.CurrentUserService.getCurrentUser(),
    };

    this.activeChat.messages.push(messageSending);
    this.messageToSend = '';
    this.updateLast();

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
  updateLast() {
    this.activeChat.messages.forEach((message) => {
      message.last = false;
    });
    this.activeChat.messages[this.activeChat.messages.length - 1].last = true;
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
      console.log('🚀 ~ MainContentComponent ~ ngOnInit ~ last:', last);
      console.log('🚀 ~ MainContentComponent ~ ngOnInit ~ main:', main);
      if (last && main) {
        document.querySelector('#endOFChat')?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 1000);
    this.activeChat.messages.forEach((message) => {
      message.last = false;
    });
    this.activeChat.messages[this.activeChat.messages.length - 1].last = true;
  }
  activeChat: ActiveChat = {
    username: 'TestUser',
    messages: [
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },

      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
      {
        username: 'TestUser',
        text: 'Test message',
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        sender: {
          id: 0,
          userName: 'TestUser',
          displayName: 'TestUser',
          avatarURL: 'TestUser',
          role: 'TestUser',
        },
      },
    ],
  };
}
