import { Body, Controller, Delete, Get, Post, Param, Put, Query } from "@nestjs/common";
import { UsersService } from "../service/users.service";
import { User, LoginResponse } from "../models/user.interface";
import { Observable } from "rxjs";
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
    const userEntity = this.dtoHelperService.createUserDroToEntity(user);
    return this.UsersService.createUser(userEntity);
  }

  // 'http://localhost:3000/users/login'
  @Post("login")
  async login(@Body() user: LoginUserDto): Promise<LoginResponse> {
    const userEntity: User = this.dtoHelperService.loginUserDtoEntity(user);
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
  async getAllUsers(): Promise<User[]> {
    return this.UsersService.findAll();
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string): Promise<any> {
    return this.UsersService.deleteUser(+id);
  }

  @Put(":id")
  async updateUser(@Param("id") id: string, @Body() user: User): Promise<any> {
    return this.UsersService.updateUser(+id, user);
  }
  @Put(":id/role")
  async updateUserRole(@Param("id") id: string, @Body() user: User): Promise<any> {
    return this.UsersService.updateUserRole(+id, user);
  }

  //TODO
  // @Patch(':id')

  //get user by username
  @Get("/find-by-username")
  async getUserByUserName(@Query("username") userName: string): Promise<User> {
    console.log(`username = ${userName}`);
    console.log(`res -->`);
    console.log(this.UsersService.getUserByUserName(userName));
    return this.UsersService.getUserByUserName(userName);
  }
}
