import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import type { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }
  async getUsers() {
    return this.userModel.find();
  }
  async getUserById(id: string) {
    return this.userModel.findById(id);
  }
  async getUserByUserNameAndPassword(userName: string, password: string) {
    console.log(this.userModel.findOne({ userName, password }));
    return this.userModel.findOne({ userName, password });
  }
}
