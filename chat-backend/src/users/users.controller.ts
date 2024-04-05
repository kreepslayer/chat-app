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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import type { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.UsersService.createUser(createUserDto);
  }
  @Get()
  getUsers() {
    return this.UsersService.getUsers();
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid) throw new HttpException('Invalid ID', 400);
    const findUser = await this.UsersService.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
  }
}
