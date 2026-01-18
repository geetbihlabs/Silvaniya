import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AdminRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      return false;
    }

    // Role hierarchy: SUPER_ADMIN > ADMIN > MANAGER > VIEWER
    const roleHierarchy: Record<AdminRole, number> = {
      [AdminRole.SUPER_ADMIN]: 4,
      [AdminRole.ADMIN]: 3,
      [AdminRole.MANAGER]: 2,
      [AdminRole.VIEWER]: 1,
    };

    const userRoleLevel = roleHierarchy[user.role as AdminRole] || 0;
    const requiredRoleLevel = Math.min(
      ...requiredRoles.map((role) => roleHierarchy[role] || 0),
    );

    return userRoleLevel >= requiredRoleLevel;
  }
}
