import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { ChatGateway } from "./getaway/chatsGetaway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./models/chat.entity";
import { activeChatEntity } from "./models/activeChat.entity";
import { MessageEntity } from "./models/message.entity";
import { ChatService } from "./services/chats.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ChatEntity, activeChatEntity, MessageEntity])],
  providers: [ChatService, ChatGateway],
})
export class ChatsModule {}
