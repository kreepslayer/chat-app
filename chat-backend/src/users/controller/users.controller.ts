import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Param,
  HttpException,
  Patch,
  Put,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { User } from '../models/user.interfase';
import { map, type Observable, catchError, throwError, of } from 'rxjs';
// import { User } from 'src/schemas/User.schema';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Post()
  createUser(@Body() user: User): Observable<User | Object> {
    return this.UsersService.createUser(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() user: User): Observable<Object> {
    return this.UsersService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  getUser(@Param() params): Observable<User> {
    return this.UsersService.getUserById(params.id);
  }

  @Get()
  getAllUsers(): Observable<User[]> {
    return this.UsersService.findAll();
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Observable<any> {
    return this.UsersService.deleteUser(+id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.UsersService.updateUser(+id, user);
  }
}
