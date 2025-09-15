import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Permission } from '@/domain/types/permissions';
import { PERMISSIONS_KEY } from '@/presentation/decorators/permissions.decorator';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '@/domain/types/request-with-user.interface';
import { ROLE_PERMISSIONS } from '@/domain/mappings/role-permissions.map';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('MISSING_USER_ROLE');
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenException('FORBIDDEN_RESOURCE');
    }

    return true;
  }
}
