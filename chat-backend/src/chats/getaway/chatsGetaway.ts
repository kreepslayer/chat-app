import { WebSocketGateway, OnGatewayConnection } from "@nestjs/websockets";
import { UsersService } from "../../users/service/users.service";
import { AuthService } from "src/auth/services/auth.service";
import { UnauthorizedException } from "@nestjs/common";
import { Socket } from "socket.io";
@WebSocketGateway({
  namespace: "chats",
  cors: {
    origin: ["http://localhost:3000", "http://localhost:4200"],
  },
})
export class ChatsGetaway implements OnGatewayConnection {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      // если токен не верен - отклоняем соединение
      const decodedToken = await this.authService.verifyJWT(socket.handshake.auth.Authorization);
      console.log("🚀 ~ ChatsGetaway ~ handleConnection ~ decodedToken:", decodedToken);
      // если все ок - получаем юзера
      const user = await this.usersService.getOneById(decodedToken.user.id);
      if (!user) {
        this.disconnect(socket);
      } else {
        console.log("welcome", user);
      }
    } catch {
      console.log("disconnect");
      return this.disconnect(socket);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit("error", new UnauthorizedException());
    socket.disconnect();
  }
}
