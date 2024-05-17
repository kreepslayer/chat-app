import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { UserEntity } from "./models/user.entity";
import { JwtGuard } from "./guards/jwt.guard";
import { JwtStrategy } from "./guards/jwt.strategy";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { FriendRequestEntity } from "./models/friend-request.entity";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: "3600s" },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity]),
    ConfigModule,
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, UserService],
  controllers: [AuthController, UserController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
