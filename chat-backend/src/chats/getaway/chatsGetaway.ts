import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/services/auth.service";
import { UsersService } from "src/users/service/users.service";
import { ChatsService } from "../services/chats.service";
import { Chat } from "../models/chat.interface";
import { User } from "src/users/models/user.interface";
import { log } from "console";
@WebSocketGateway({
  cors: {
    origin: ["*", "http://localhost:4200", "http://localhost:3000"],
  },
  // namespace: "/chats",
})
export class ChatsGetaway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private chatsService: ChatsService,
  ) {}
  @SubscribeMessage("message")
  handleMessage(client: any, payload: any) {
    console.log("payload:", payload);
  }
  async handleConnection(socket: Socket) {
    try {
      // если токен не верен - отклоняем соединение
      const decodedToken = await this.authService.verifyJWT(socket.handshake.headers.authorization);
      console.log("🚀 ~ ChatsGetaway ~ handleConnection ~ decodedToken:", decodedToken);
      // если все ок - получаем юзера
      const user = await this.usersService.getOneById(decodedToken.user.id);
      if (!user) {
        this.disconnect(socket);
      } else {
        socket.data.user = user;
        console.log("🚀 ~ ChatsGetaway ~ handleConnection ~ socket.data.user.id:", socket.data.user.id);
        const chats: Chat[] = await this.chatsService.getChatsForUser(user.id);
        //отправляем юзеру его чаты
        log("emit chats");
        console.log("🚀 ~ ChatsGetaway ~ handleConnection ~ chats:", chats);
        // chats.forEach((chat: Chat) => {
        //   console.log(`🚀 ~ ChatsGetaway ~ handleConnection ~ ${chat.name} users:`, chat.users);
        // });
        return this.server.to(socket.id).emit("chats", chats);
      }
    } catch {
      console.log("disconnect");
      return this.disconnect(socket);
    }
    console.log(`on connect`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`on disconnect`);
    this.disconnect(socket);
  }

  private disconnect(socket: Socket) {
    socket.emit("ERROR", new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage("createChat")
  async onCreateChat(socket: Socket, chat: Chat): Promise<Chat> {
    console.log("🚀 ~ ChatsGetaway ~ onCreateChat ~ chat:", chat);
    console.log("🚀 ~ ChatsGetaway ~ onCreateChat ~ socket.data:", socket.data);
    return await this.chatsService.createChat(chat, socket.data.user);
  }

  @SubscribeMessage("dropTable")
  async DropTable(socket: Socket) {
    return await this.chatsService.dropTable();
  }

  @SubscribeMessage("chatsInSidebar")
  async getChatsInSidebar(socket: Socket) {
    const chatsInSidebar = await this.chatsService.getChatsInSidebar(socket.data.user);
    return this.server.to(socket.id).emit("chatsInSidebar", chatsInSidebar);
  }

  @SubscribeMessage("sendMessage")
  async sendMessage(socket: Socket, message: any) {
    this.server.to(socket.id).emit("newMessage", message);
  }
}
