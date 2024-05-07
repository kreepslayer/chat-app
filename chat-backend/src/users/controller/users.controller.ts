import { Body, Controller, Delete, Get, Post, UsePipes, ValidationPipe, Param, HttpException, Patch, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "../service/users.service";
import { User, LoginResponse } from "../models/user.interfase";
import { map, Observable, catchError, throwError, of } from "rxjs";
import { log } from "console";
// import { User } from 'src/schemas/User.schema';
import { DtoHelperService } from "../dto/dto-helper.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";

@Controller("users")
export class UsersController {
  constructor(
    private UsersService: UsersService,
    private dtoHelperService: DtoHelperService,
  ) {}

  //'http://localhost:3000/users + {user}'
  @Post("register")
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    const userEntity = await this.dtoHelperService.createUserDroToEntity(user);
    return this.UsersService.createUser(userEntity);
  }

  // 'http://localhost:3000/users/login'
  @Post("login")
  async login(@Body() user: LoginUserDto): Promise<LoginResponse> {
    const userEntity: User = await this.dtoHelperService.loginUserDtoEntity(user);
    const jwt: string = await this.UsersService.login(userEntity);
    return {
      access_token: jwt,
      token_type: "JWT",
      expires_in: 10000,
    };
  }

  // 'http://localhost:3000/users/:id'
  // @Get(":id")
  // getUser(@Param() params): Observable<User> {
  //   return this.UsersService.getUserById(params.id);
  // }

  // 'http://localhost:3000/users'
  @Get()
  getAllUsers(): Observable<User[]> {
    return this.UsersService.findAll();
  }

  @Delete(":id")
  deleteUser(@Param("id") id: string): Observable<any> {
    return this.UsersService.deleteUser(+id);
  }

  @Put(":id")
  updateUser(@Param("id") id: string, @Body() user: User): Observable<any> {
    return this.UsersService.updateUser(+id, user);
  }
  @Put(":id/role")
  updateUserRole(@Param("id") id: string, @Body() user: User): Observable<any> {
    return this.UsersService.updateUserRole(+id, user);
  }
  //TODO
  // @Patch(':id')

  //get user by username
  @Get(":userName")
  getUserByUserName(@Param("userName") userName: string): Observable<User> {
    return this.UsersService.getUserByUserName(userName);
  }
}
