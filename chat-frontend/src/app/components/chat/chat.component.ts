import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  constructor() {}
  @Input() username: string = '';
  @Input() lastMessage: string = '';
  @Input() notifications: number = 0;
}
