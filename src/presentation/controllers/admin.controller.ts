import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { Permission } from '@/domain/types/permissions';
import type { RequestWithUser } from '@/domain/types/request-with-user.interface';

@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminController {
  @Get('user-management')
  @Permissions(Permission.READ_USERS, Permission.WRITE_USERS)
  getUserManagement(@Req() req: RequestWithUser) {
    return {
      message: 'User management access granted',
      user: req.user,
    };
  }
}
