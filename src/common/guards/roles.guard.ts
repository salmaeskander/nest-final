// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import type { Request } from 'express';
// import { ROLES_KEY } from '../decorators/roles.decorator';
// import type { JwtPayload } from '../types/jwt-payload.type';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiredRoles || requiredRoles.length === 0) {
//       return true;
//     }

//     const request = context
//       .switchToHttp()
//       .getRequest<Request & { user?: JwtPayload }>();
//     const { user } = request;
//     if (!user) {
//       return false;
//     }

//     return requiredRoles.includes(user.role);
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { JwtPayload } from '../types/jwt-payload.type';
import type { Request } from 'express';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const user = request.user;
    if (!user) throw new ForbiddenException('No user found');

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
