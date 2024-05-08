import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./create-user.dto";
import { User } from "../models/user.interface";
import { LoginUserDto } from "./login-user.dto";

@Injectable()
export class DtoHelperService {
  createUserDroToEntity(createUserDto: CreateUserDto): User {
    return {
      userName: createUserDto.userName,
      password: createUserDto.password,
    };
  }

  loginUserDtoEntity(loginUserDto: LoginUserDto): User {
    return {
      userName: loginUserDto.userName,
      password: loginUserDto.password,
    };
  }
}
