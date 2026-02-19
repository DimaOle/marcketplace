import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/generated/prisma/enums';
import { KEY_ROLE } from '../decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const reqRoles = this.reflector.getAllAndOverride<Role[]>(KEY_ROLE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!reqRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const roles = request.user?.role;

    if (!roles) {
      throw new ForbiddenException(`You do not have access rights`);
    }
    const userRoles = Array.isArray(roles) ? roles : [roles];
    return this.getMatchRoles(reqRoles, userRoles);
  }

  private getMatchRoles(reqRoles: string[], userRoles: string[]): boolean {
    for (let i = 0; i < reqRoles.length; i++) {
      const match = userRoles.some((el) => el === reqRoles[i]);
      if (match) {
        return true;
      }
    }
    return false;
  }
}
