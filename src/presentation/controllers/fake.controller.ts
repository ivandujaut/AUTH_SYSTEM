import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import type { RequestWithUser } from '@/domain/types/request-with-user.interface';
import { RolesGuard } from '../guards/roles.guard';

@Controller('auth')
export class FakeController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('protected')
  getProtected(@Request() req: RequestWithUser) {
    return {
      message: 'ONLY_ADMINS_CAN_SEE_THIS',
      user: req.user,
    };
  }
}
