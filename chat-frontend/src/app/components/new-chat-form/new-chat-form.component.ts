import { Component, OnInit } from '@angular/core';
// import { CurrentUserService } from '../../services/currentUser.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import type { Chat } from '../../models/chat.interface';

@Component({
  selector: 'app-new-chat-form',
  templateUrl: './new-chat-form.component.html',
  styleUrl: './new-chat-form.component.scss',
})
export class NewChatFormComponent implements OnInit {
  newChatForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    chatName: new FormControl('none'),
  });
  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    const chat: Chat = {};
    chat.users = [
      {
        userName: this.newChatForm.value.userName,
      },
    ];
    chat.name = this.newChatForm.value.chatName;
    this.chatService.createChat(chat);
  }
}
