import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import type { User } from 'src/users/models/user.interfase';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  generateJWT(payload: User): Observable<string> {
    return from(this.jwtService.signAsync(payload));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePasswords(newPassword: string, passwordHash: string): Observable<any> {
    return from<any | boolean>(bcrypt.compare(newPassword, passwordHash));
  }
}
