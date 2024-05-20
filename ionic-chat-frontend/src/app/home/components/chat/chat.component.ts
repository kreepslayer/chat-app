import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Chat } from '../../models/Chat';
import { Message } from '../../models/Message';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
    @ViewChild('form') form: NgForm;

    userFullImagePath: string;
    userId: number;

    chats$: Observable<Chat[]>;
    chats: Chat[] = [];
    chat: Chat;

    newMessage$: Observable<string>;
    messages: Message[] = [];

    friends: User[] = [];
    friend: User;
    friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});

    selectedChatIndex: number = 0;

    private userImagePathSubscription: Subscription;
    private userIdSubscription: Subscription;
    private messagesSubscription: Subscription;
    private chatSubscription: Subscription;
    private newMessagesSubscription: Subscription;
    private friendsSubscription: Subscription;
    private friendSubscription: Subscription;

    constructor(
        private chatService: ChatService,
        private authService: AuthService
    ) {}

    scrollToBottom() {
        let chat = document.querySelector('.chat');
        let last: HTMLElement | null = document.querySelector('#endOFChat');
        if (last && chat) {
            document.querySelector('#endOFChat')?.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }

    ionViewDidEnter() {
        console.log(
            123,
            'chatIndex->',
            this.selectedChatIndex,
            'chats->',
            this.chats,
            'chat->',
            this.chat,
            'messages->',
            this.messages,
            'friends->',
            this.friends,
            'friend->,',
            this.friend
        );

        this.userImagePathSubscription =
            this.authService.userFullImagePath.subscribe(
                (fullImagePath: string) => {
                    this.userFullImagePath = fullImagePath;
                }
            );

        this.userIdSubscription = this.authService.userId.subscribe(
            (userId: number) => {
                this.userId = userId;
            }
        );

        this.chatSubscription = this.chatService
            .getChats()
            .subscribe((chats: Chat[]) => {
                this.chats.push(chats[0]); // Note: from mergeMap stream
            });

        this.messagesSubscription = this.chatService
            .getChatMessages()
            .subscribe((messages: Message[]) => {
                messages.forEach((message: Message) => {
                    const allMessageIds = this.messages.map(
                        (message: Message) => message.id
                    );
                    if (!allMessageIds.includes(message.id)) {
                        this.messages.push(message);
                    }
                });

                this.scrollToBottom();
            });

        this.newMessagesSubscription = this.chatService
            .getNewMessage()
            .subscribe((message: Message) => {
                message.createdAt = new Date();

                const allMessageIds = this.messages.map(
                    (message: Message) => message.id
                );
                if (!allMessageIds.includes(message.id)) {
                    this.messages.push(message);
                }
            });

        this.friendSubscription = this.friend$.subscribe((friend: any) => {
            if (JSON.stringify(friend) !== '{}') {
                this.chatService.joinChat(this.friend.id);
            }
        });

        this.friendsSubscription = this.chatService
            .getFriends()
            .subscribe((friends: User[]) => {
                this.friends = friends;

                if (friends.length > 0) {
                    this.friend = this.friends[0];
                    this.friend$.next(this.friend);

                    friends.forEach((friend: User) => {
                        this.chatService.createChat(friend);
                    });
                    this.chatService.joinChat(this.friend.id);
                }
            });
    }

    onSubmit() {
        const { message } = this.form.value;
        console.log('🚀 ~ ChatComponent ~ onSubmit ~ message:', message);
        if (!message) return;

        let conversationUserIds = [this.userId, this.friend.id].sort();

        this.chats.forEach((conversation: Chat) => {
            let userIds = conversation.users
                .map((user: User) => user.id)
                .sort();

            if (
                JSON.stringify(conversationUserIds) === JSON.stringify(userIds)
            ) {
                this.chat = conversation;
            }
        });

        this.chatService.sendMessage(message, this.chat);
        this.form.reset();
        setTimeout(() => {
            this.scrollToBottom();
        }, 500);
    }

    openConversation(friend: User, index: number): void {
        this.selectedChatIndex = index;

        this.chatService.leaveChat();

        this.friend = friend;
        this.friend$.next(this.friend);

        this.messages = [];
        setTimeout(() => {
            this.scrollToBottom();
        }, 350);
    }

    deriveFullImagePath(user: User): string {
        let url = 'http://localhost:3000/api/feed/image/';

        if (user.id === this.userId) {
            return this.userFullImagePath;
        } else if (user.imagePath) {
            return url + user.imagePath;
        } else if (this.friend.imagePath) {
            return url + this.friend.imagePath;
        } else {
            return url + 'blank-profile-picture.png';
        }
    }

    ionViewDidLeave() {
        this.chatService.leaveChat();

        this.selectedChatIndex = 0;
        this.chats = [];
        this.chat = undefined;
        this.messages = [];
        this.friends = [];
        this.friend = undefined;

        this.messagesSubscription.unsubscribe();
        this.userImagePathSubscription.unsubscribe();
        this.userIdSubscription.unsubscribe();
        this.chatSubscription.unsubscribe();
        this.newMessagesSubscription.unsubscribe();
        this.friendsSubscription.unsubscribe();
        this.friendSubscription.unsubscribe();
    }
}
