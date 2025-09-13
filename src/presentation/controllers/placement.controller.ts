import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { Permission } from '@/domain/types/permissions';
import type { RequestWithUser } from '@/domain/types/request-with-user.interface';
import { PlacementService } from '@/domain/services/placement.service';
import { CreatePlacementDto } from '../dto/create-placement.dto';

@Controller('placements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  @Get()
  @Permissions(Permission.VIEW_PLACEMENT)
  async getAll(@Req() req: RequestWithUser) {
    const placements = await this.placementService.findAll();
    return {
      message: 'PLACEMENTS_RETRIEVED',
      user: req.user,
      data: placements,
    };
  }

  @Post()
  @Permissions(Permission.CREATE_PLACEMENT)
  async create(@Body() dto: CreatePlacementDto, @Req() req: RequestWithUser) {
    const placement = await this.placementService.create(dto);
    return {
      message: 'PLACEMENT_CREATED',
      user: req.user,
      data: placement,
    };
  }
}
