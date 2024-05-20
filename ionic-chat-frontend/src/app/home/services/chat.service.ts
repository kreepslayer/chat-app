import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { User } from 'src/app/auth/models/user.model';
import { ChatSocketService } from 'src/app/core/chat-socket.service';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private socket: ChatSocketService, private http: HttpClient) {}

    getFriends(): Observable<User[]> {
        return this.http.get<User[]>(
            `${environment.baseApiUrl}/user/friends/my`
        );
    }

    sendMessage(message: string, chat: Chat): void {
        const newMessage: Message = {
            message,
            chat,
        };
        console.log(
            '🚀 ~ ChatService(front) ~ sendMessage ~ newMessage:',
            newMessage
        );
        this.socket.emit('sendMessage', newMessage);
    }

    getNewMessage(): Observable<Message> {
        return this.socket.fromEvent<Message>('newMessage');
    }

    createChat(friend: User): void {
        this.socket.emit('createChat', friend);
    }

    joinChat(friendId: number): void {
        this.socket.emit('joinChat', friendId);
    }

    leaveChat(): void {
        this.socket.emit('leaveChat');
    }

    getChatMessages(): Observable<Message[]> {
        return this.socket.fromEvent<Message[]>('messages');
    }

    getChats(): Observable<Chat[]> {
        return this.socket.fromEvent<Chat[]>('chats');
    }
}
