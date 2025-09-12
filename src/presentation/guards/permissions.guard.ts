import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@/presentation/decorators/permissions.decorator';
import { Permission } from '@/domain/types/permissions';
import { RequestWithUser } from '@/domain/types/request-with-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions?.length) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.permissions?.length) return false;

    const hasPermission = requiredPermissions.some((p) => user.permissions.includes(p));

    if (!hasPermission) {
      throw new ForbiddenException('INSUFFICIENT_PERMISSIONS');
    }

    return true;
  }
}
