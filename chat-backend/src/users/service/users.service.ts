import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../models/user.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../models/enteties/user.entity";
import { Like, Repository } from "typeorm";
import { catchError, from, map, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { log } from "console";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private AuthService: AuthService,
  ) {}

  async createUser(user: User): Promise<User> {
    try {
      const userNameExists = await this.userNameExists(user.userName);
      if (!userNameExists) {
        const passwordHash = await this.AuthService.hashPassword(user.password);
        user.password = passwordHash;
        const newUser = await this.userRepository.save(this.userRepository.create(user));
        return this.findOne(newUser.id);
      } else {
        throw new HttpException("Username already exists", HttpStatus.CONFLICT);
      }
    } catch {
      throw new HttpException("Username already exists", HttpStatus.CONFLICT);
    }
  }

  async login(user: User): Promise<string> {
    try {
      const foundUser = await this.findByUserName(user.userName);
      if (foundUser) {
        const passwordMatched = await this.AuthService.comparePasswords(user.password, foundUser.password);
        if (passwordMatched) {
          const payload: User = await this.findOne(foundUser.id);
          return this.AuthService.generateJWT(payload);
        } else {
          throw new HttpException("Login success but wrong credentials", HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
    } catch {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }

  async deleteUser(id: number): Promise<any> {
    return from(this.userRepository.delete(id));
  }
  async updateUser(id: number, user: User): Promise<any> {
    delete user.password;
    return from(this.userRepository.update(id, user));
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async getUserById(id: number): Promise<User> {
    log(`id: $ {
      id
    }`);
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
  async getUserByUserName(userName: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        userName: Like(`%${userName}%`),
      },
    });
  }

  async updateUserRole(id: number, user: User): Promise<any> {
    return from(this.userRepository.update(id, user));
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  private async userNameExists(userName: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        userName,
      },
    });
    return !!user;
  }

  async findByUserName(userName: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        userName,
      },
      select: ["id", "userName", "password"],
    });
  }

  async getOneById(id: number): Promise<User> {
    return this.userRepository.findOneByOrFail({
      id: id,
    });
  }
  async getOneByName(username: string): Promise<User> {
    return this.userRepository.findOneByOrFail({
      userName: username,
    });
  }
}
