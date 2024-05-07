import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../models/user.interfase";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../models/user.entity";
import { Repository } from "typeorm";
import { catchError, from, map, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { log } from "console";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private AuthService: AuthService,
  ) {}

  async createUser(user: User): Promise<User> {
    const userNameExists = await this.userNameExists(user.userName);
    if (userNameExists === false) {
      const passwordHash = await this.AuthService.hashPassword(user.password);
      user.password = passwordHash;

      const newUser = await this.userRepository.save(this.userRepository.create(user));
      return this.findOne(newUser.id);
    } else {
      throw new HttpException("Username already exists", HttpStatus.CONFLICT);
    }
  }

  async login(user: User): Promise<string> {
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
  }

  deleteUser(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }
  updateUser(id: number, user: User): Observable<any> {
    delete user.password;
    return from(this.userRepository.update(id, user));
  }
  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (user) {
          delete user.password;
        });
        return users;
      }),
    );
  }
  getUserById(id: number): Observable<User> {
    log(`id: ${id}`);
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  // validateUser(userName: string, password: string): Observable<User> {
  //   return this.getUserByUserName(userName).pipe(
  //     switchMap(user =>
  //       this.AuthService.comparePasswords(password, user.password).pipe(
  //         map((match: boolean) => {
  //           if (match) {
  //             const { password, ...result } = user;
  //             return result;
  //           } else {
  //             throw Error;
  //           }
  //         }),
  //       ),
  //     ),
  //   );
  // }

  getUserByUserName(userName: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { userName } }));
  }

  updateUserRole(id: number, user: User): Observable<any> {
    return from(this.userRepository.update(id, user));
  }

  private async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async userNameExists(userName: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userName } });
    return !!user;
  }
  private async findByUserName(userName: string): Promise<User> {
    return this.userRepository.findOne({ where: { userName }, select: ["id", "userName", "password"] });
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
