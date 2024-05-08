import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { ChatsGetaway } from "./getaway/chatsGetaway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./models/chat.entety";
import { ChatsService } from "./services/chats.service";

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([ChatEntity])],
  providers: [ChatsService, ChatsGetaway],
})
export class ChatsModule {}
