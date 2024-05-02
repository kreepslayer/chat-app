import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  constructor() {}
  @Input() username: string = 'testName';
  @Input() lastMessage: string = 'testMessage';
  @Input() notifications: number = 10;
}
