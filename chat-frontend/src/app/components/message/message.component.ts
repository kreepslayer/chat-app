import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() message =
    'Message text lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  @Input() time = new Date().getHours() + ':' + new Date().getMinutes();
  Users = ['User1', 'User2'];
  rndUser = Math.floor(Math.random() * this.Users.length);
  username: string = this.Users[this.rndUser];

  constructor() {}

  ngOnInit() {
    if (new Date().getMinutes() < 10) {
      this.time = new Date().getHours() + ':0' + new Date().getMinutes();
    }
  }
}
