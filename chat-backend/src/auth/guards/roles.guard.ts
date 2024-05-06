import { ExecutionContext, Injectable, CanActivate, Inject, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { log } from "console";
import { map, Observable } from "rxjs";
import type { User } from "src/users/models/user.interfase";
import { UsersService } from "src/users/service/users.service";
import { hasRoles } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user.user;
    console.log(`user from roles guard:`);
    console.log(user);

    return this.usersService.getUserById(user.id).pipe(
      map((user: User) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermission: boolean = false;
        if (hasRole()) {
          log(`hasRoles - true`);
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );

    log(user);
    return true;
  }
}
