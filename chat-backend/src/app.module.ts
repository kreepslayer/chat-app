import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { userModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/models/user.entity";
import { AuthService } from "./auth/services/auth.service";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { ChatsModule } from "./chats/chats.module";

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
      entities: [UserEntity],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE2_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [UserEntity],
    }),
    userModule,
    ChatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {}
// export class AppModule {}
