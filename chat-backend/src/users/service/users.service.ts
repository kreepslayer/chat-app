import { Injectable } from '@nestjs/common';
import { User } from '../models/user.interfase';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private AuthService: AuthService,
  ) {}

  createUser(user: User): Observable<User> {
    // return from(this.userRepository.save(user)); non hashed

    return this.AuthService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.userName = user.userName;
        newUser.password = passwordHash;
        newUser.displayName = user.displayName;
        newUser.avatarURL = user.avatarURL;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
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
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.userName, user.password).pipe(
      switchMap((user: User) => {
        if (user)
          return this.AuthService.generateJWT(user).pipe(
            map((jwt: string) => jwt),
          );
        else return 'Wrong credentials';
      }),
    );
  }
  validateUser(userName: string, password: string): Observable<User> {
    return this.getUserByUserName(userName).pipe(
      switchMap((user) =>
        this.AuthService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }

  getUserByUserName(userName: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { userName } }));
  }
}
