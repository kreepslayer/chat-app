import { Module } from "@nestjs/common";
import { ChatsService } from "./service/chats.service";
import { ChatsController } from "./controller/chats.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./models/chat.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ChatEntity])],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class chatsModule {}
