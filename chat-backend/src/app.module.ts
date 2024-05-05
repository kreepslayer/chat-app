import { Module, MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { userModule } from "./users/users.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { chatsModule } from "./chats/chats.module";
import { UserEntity } from "./users/models/user.entity";
import { ChatEntity } from "./chats/models/chat.entity";
import { MessageEntity } from "./chats/models/message.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE1_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [UserEntity, ChatEntity, MessageEntity],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE2_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [UserEntity, ChatEntity, MessageEntity],
    }),
    userModule,
    chatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "users", method: RequestMethod.ALL });
  }
}
