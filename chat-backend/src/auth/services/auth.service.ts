import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { from, Observable } from "rxjs";
import { User } from "src/users/models/user.interfase";
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
}
