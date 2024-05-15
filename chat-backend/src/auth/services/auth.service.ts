import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { catchError, from, map, Observable, of } from "rxjs";
import { User } from "src/users/models/user.interface";
const bcrypt = require("bcrypt");
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async generateJWT(user: User): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(newPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }

  async verifyJWT(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }

  getJWTuser(jwt: string): Observable<User | null> {
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
