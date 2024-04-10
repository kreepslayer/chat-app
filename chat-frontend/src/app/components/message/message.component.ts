import { Component } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  message: string =
    'Message text dsjgui9sdjgioashdpgu9isahdgioyjebrt87hmuwhyt,nyjhr9ekg7o80erwu9hygjewr98gu7i9';
  time: string = new Date().getHours() + ':' + new Date().getMinutes();

  constructor() {}

  ngOnInit() {
    if (new Date().getMinutes() < 10) {
      this.time = new Date().getHours() + ':0' + new Date().getMinutes();
    }
  }
}
