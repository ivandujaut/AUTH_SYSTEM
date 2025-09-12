import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('secure')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SecureController {
  @Get('admin-only')
  @Roles(Role.ADMIN)
  adminOnly(@Req() req: Request) {
    return {
      message: 'Access granted: ADMIN only',
      user: req.user,
    };
  }

  @Get('manager-or-admin')
  @Roles(Role.MANAGER, Role.ADMIN)
  managerOrAdmin(@Req() req: Request) {
    return {
      message: 'Access granted: MANAGER or ADMIN',
      user: req.user,
    };
  }
}
