import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { Permission } from '@/domain/types/permissions';
import type { RequestWithUser } from '@/domain/types/request-with-user.interface';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  @Get()
  @Permissions(Permission.VIEW_DASHBOARD)
  getDashboard(@Req() req: RequestWithUser) {
    return {
      message: 'Dashboard access granted',
      user: req.user,
    };
  }
}
