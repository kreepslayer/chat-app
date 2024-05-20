import { Module, RequestMethod, type MiddlewareConsumer, type NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth/services/auth.service";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { ChatsModule } from "./chats/chats.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { UserEntity } from "./auth/models/user.entity";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./core/all-exceptions.filter";
import { FeedModule } from "./feed/feed.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // в продакшене выключить(вроде :) )
    }),
    AuthModule,
    ChatsModule,
    ConfigModule,
    TypeOrmModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
