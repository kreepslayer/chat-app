import { OnModuleInit, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { of, Subscription, take, tap } from "rxjs";
import { Server, Socket } from "socket.io";

import { JwtGuard } from "src/auth/guards/jwt.guard";
import { User } from "src/auth/models/user.class";
import { AuthService } from "src/auth/services/auth.service";
import { ActiveChat } from "../models/activeChat.interface";
import { Message } from "../models/message.interface";
import { ChatService } from "../services/chats.service";

@WebSocketGateway({ cors: { origin: ["http://localhost:8100"] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  // Note: Runs when server starts - Remove in production
  onModuleInit() {
    this.chatService.removeActiveChats().pipe(take(1)).subscribe();
    this.chatService.removeMessages().pipe(take(1)).subscribe();
    this.chatService.removeChats().pipe(take(1)).subscribe();
  }

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtGuard)
  handleConnection(socket: Socket) {
    console.log("HANDLE CONNECTION");
    const jwt = socket.handshake.headers.authorization || null;
    this.authService.getJwtUser(jwt).subscribe((user: User) => {
      if (!user) {
        console.log("No USER");
        this.handleDisconnect(socket);
      } else {
        socket.data.user = user;
        this.getChats(socket, user.id);
      }
    });
  }

  getChats(socket: Socket, userId: number): Subscription {
    return this.chatService.getChatsWithUsers(userId).subscribe(chat => {
      this.server.to(socket.id).emit("chats", chat);
    });
  }

  handleDisconnect(socket: Socket) {
    console.log("HANDLE DISCONNECT");
    this.chatService.leaveChat(socket.id).pipe(take(1)).subscribe();
  }

  @SubscribeMessage("createChat")
  createChat(socket: Socket, friend: User) {
    this.chatService
      .createChat(socket.data.user, friend)
      .pipe(take(1))
      .subscribe(() => {
        this.getChats(socket, socket.data.user.id);
      });
  }

  @SubscribeMessage("sendMessage")
  handleMessage(socket: Socket, newMessage: Message) {
    if (!newMessage.chat) return of(null);

    const { user } = socket.data;
    newMessage.user = user;

    if (newMessage.chat.id) {
      this.chatService
        .createMessage(newMessage)
        .pipe(take(1))
        .subscribe((message: Message) => {
          newMessage.id = message.id;

          this.chatService
            .getActiveUsers(newMessage.chat.id)
            .pipe(take(1))
            .subscribe((activeChats: ActiveChat[]) => {
              activeChats.forEach((activeChat: ActiveChat) => {
                this.server.to(activeChat.socketId).emit("newMessage", newMessage);
              });
            });
        });
    }
  }

  @SubscribeMessage("joinChat")
  joinChat(socket: Socket, friendId: number) {
    this.chatService
      .joinChat(friendId, socket.data.user.id, socket.id)
      .pipe(
        tap((activeChat: ActiveChat) => {
          this.chatService
            .getMessages(activeChat.chatId)
            .pipe(take(1))
            .subscribe((messages: Message[]) => {
              this.server.to(socket.id).emit("messages", messages);
            });
        }),
      )
      .pipe(take(1))
      .subscribe();
  }

  @SubscribeMessage("leaveChat")
  leaveChat(socket: Socket) {
    this.chatService.leaveChat(socket.id).pipe(take(1)).subscribe();
  }
}
