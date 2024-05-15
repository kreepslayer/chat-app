import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { UnauthorizedException, UseGuards, type OnModuleInit } from "@nestjs/common";
import { AuthService } from "src/auth/services/auth.service";
import { UsersService } from "src/users/service/users.service";
import { ChatsService } from "../services/chats.service";
import { Chat } from "../models/chat.interface";
import { User } from "src/users/models/user.interface";
import { log } from "console";
import type { Message } from "../models/message.interface";
import { of, take, tap, type Observable, type Subscription } from "rxjs";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { activeChat } from "../models/activeChat.interface";
@WebSocketGateway({
  cors: {
    origin: ["*", "http://localhost:4200", "http://localhost:3000"],
  },
  // namespace: "/chats",
})
export class ChatsGetaway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private chatsService: ChatsService,
  ) {}
  onModuleInit() {
    this.chatsService.removeActiveChat().pipe(take(1)).subscribe();
    this.chatsService.removeMessages().pipe(take(1)).subscribe();
    this.chatsService.removeChats().pipe(take(1)).subscribe();
  }

  //FIXME не работает(через раз)
  // @UseGuards(JwtAuthGuard)
  handleConnection(socket: Socket) {
    console.log("HANDLE CONNECTION");
    const jwt = socket.handshake.headers.authorization || null;
    this.authService.getJWTuser(jwt).subscribe((user: User) => {
      if (!user) {
        console.warn("No USER");
        this.handleDisconnect(socket);
      } else {
        socket.data.user = user;
        this.getChats(socket, user.id);
      }
    });
  }

  getChats(socket: Socket, userId: number): Subscription {
    return this.chatsService.getChatsWithUser(userId).subscribe(chats => {
      this.server.to(socket.id).emit("chats", chats);
    });
  }

  handleDisconnect(socket: Socket) {
    console.warn("HANDLE DISCONNECT");
    this.chatsService.leaveChat(socket.id).pipe(take(1)).subscribe();
  }

  private disconnect(socket: Socket) {
    socket.emit("ERROR", new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage("dropTable")
  async DropTable(socket: Socket) {
    return await this.chatsService.dropTable();
  }
  @SubscribeMessage("createChat")
  createChat(socket: Socket, user: User) {
    //there user(from properties) is 2nd user to create chat with
    this.chatsService
      .createChat(socket.data.user, user)
      .pipe(take(1))
      .subscribe(() => {
        this.getChats(socket, socket.data.user.id);
      });
  }

  @SubscribeMessage("sendMessage")
  handleMessage(socket: Socket, newMessage: Message) {
    if (!newMessage.chat) {
      return of(null);
    }

    const { user } = socket.data;

    newMessage.user = user;

    if (newMessage.chat.id) {
      this.chatsService
        .createMessage(newMessage)
        .pipe(take(1))
        .subscribe((message: Message) => {
          newMessage.id = message.id;

          this.chatsService
            .getActiveUsers(newMessage.chat.id)
            .pipe(take(1))
            .subscribe((activeChats: activeChat[]) => {
              activeChats.forEach((activeChat: activeChat) => {
                this.server.to(activeChat.socketId).emit("newMessage", newMessage);
              });
            });
        });
    }
  }

  @SubscribeMessage("joinChat")
  joinChat(socket: Socket, userId: number) {
    this.chatsService
      .joinChat(userId, socket.data.user.id, socket.id)
      .pipe(
        tap((activeChat: activeChat) => {
          this.chatsService
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
    this.chatsService.leaveChat(socket.id).pipe(take(1)).subscribe();
  }
}
