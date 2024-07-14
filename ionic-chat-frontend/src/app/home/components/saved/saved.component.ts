import { Component, OnInit } from '@angular/core';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/Chat';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-saved',
    templateUrl: './saved.component.html',
    styleUrls: ['./saved.component.scss'],
})
export class SavedComponent implements OnInit {
    constructor(
        public connectionProfileService: ConnectionProfileService,
        private chatService: ChatService
    ) {}

    savedChats: Chat[] = [];
    savedChatsSubscription: Subscription;

    ngOnInit() {}
}
