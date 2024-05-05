import { Body, Controller, Delete, Get, Post, UsePipes, ValidationPipe, Param, HttpException, Patch, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "../service/users.service";
import { User, UserRole } from "../models/user.interfase";
import { map, Observable, catchError, throwError, of } from "rxjs";
import { hasRoles } from "src/auth/decorator/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { log } from "console";
// import { User } from 'src/schemas/User.schema';

@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  //'http://localhost:3000/users + {user}'
  @Post("register")
  createUser(@Body() user: User): Observable<User | Object> {
    return this.UsersService.createUser(user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message })),
    );
  }

  // 'http://localhost:3000/users/login'
  @Post("login")
  @UsePipes(ValidationPipe)
  login(@Body() user: User): Observable<Object> {
    let FullUser = this.UsersService.getUserByUserName(user.userName).subscribe({ next: data => (FullUser = data) });
    console.log("🚀 ~ UsersController ~ login ~ user.userName:", user.userName);
    console.log("🚀 ~ UsersController ~ login ~ FullUser:", FullUser);
    return this.UsersService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt, success: true, FullUser: FullUser };
      }),
      catchError(err => throwError(new HttpException(err.message, 401))),
    );
  }

  // 'http://localhost:3000/users/:id'
  // @Get(":id")
  // getUser(@Param() params): Observable<User> {
  //   return this.UsersService.getUserById(params.id);
  // }

  // 'http://localhost:3000/users'
  @hasRoles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
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
