import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcrypt";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { Repository } from "typeorm";
import { UserEntity } from "../models/user.entity";
import { User } from "../models/user.class";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  doesUserExist(userName: string): Observable<boolean> {
    console.log("🚀 ~ AuthService ~ doesUserExist ~ userName:", userName);
    return from(this.userRepository.findOne({ where: { userName } })).pipe(
      switchMap((user: User) => {
        return of(!!user);
      }),
    );
  }

  registerAccount(user: User): Observable<User> {
    const { userName, password } = user;

    return this.doesUserExist(userName).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist) throw new HttpException("A user has already been created with this email address", HttpStatus.BAD_REQUEST);
      }),
      switchMap(() => {
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword: string) => {
            return from(
              this.userRepository.save({
                userName,
                password: hashedPassword,
              }),
            ).pipe(
              map((user: User) => {
                delete user.password;
                return user;
              }),
            );
          }),
        );
      }),
    );
  }

  validateUser(userName: string, password: string): Observable<User> {
    console.log("🚀 ~ AuthService ~ validateUser ~ password:", password);
    console.log("🚀 ~ AuthService ~ validateUser ~ userName:", userName);

    return from(this.userRepository.findOneBy({ userName })).pipe(
      switchMap((user: User) => {
        if (!user) {
          console.warn(`No user found for username: ${userName}`);
          throw new HttpException({ status: HttpStatus.FORBIDDEN, error: "Invalid Credentials" }, HttpStatus.FORBIDDEN);
        }
        console.log("🚀 ~ AuthService ~ validateUser ~ user:", user);
        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              console.log("password is valid");
              delete user.password;
              return user;
            }
            console.log("password is not valid");
          }),
        );
      }),
    );
  }

  login(user: User): Observable<string> {
    const { userName, password } = user;
    console.log("🚀 ~ AuthService ~ login ~ password:", password);
    console.log("🚀 ~ AuthService ~ login ~ userName:", userName);
    return this.validateUser(userName, password).pipe(
      switchMap((user: User) => {
        if (user) {
          // create JWT - credentials
          return from(this.jwtService.signAsync({ user }));
        }
      }),
    );
  }

  getJwtUser(jwt: string): Observable<User | null> {
    return from(this.jwtService.verifyAsync(jwt)).pipe(
      map(({ user }: { user: User }) => {
        return user;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }
}
