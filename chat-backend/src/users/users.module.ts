import { Module } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { UsersController } from "./controller/users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./models/enteties/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { DtoHelperService } from "./dto/dto-helper.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, DtoHelperService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
