import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() message: string = '';
  @Input() time = new Date().getHours() + ':' + new Date().getMinutes();
  @Input() Username = '';
  @Input() last = false;

  constructor() {}

  ngOnInit() {
    if (new Date().getMinutes() < 10) {
      this.time = new Date().getHours() + ':0' + new Date().getMinutes();
    }
  }
}
