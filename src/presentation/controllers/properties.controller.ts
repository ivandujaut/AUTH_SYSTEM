import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { Permission } from '@/domain/types/permissions';
import type { RequestWithUser } from '@/domain/types/request-with-user.interface';
import { PropertyService } from '@/domain/services/property.service';
import { CreatePropertyDto } from '../dto/create-property.dto';

@Controller('properties')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PropertiesController {
  constructor(private readonly propertyService: PropertyService) {}

  /**
   * Public endpoint to fetch all available properties.
   * Requires: view:properties
   */
  @Get()
  @Permissions(Permission.VIEW_PROPERTIES)
  async getAll(@Req() req: RequestWithUser) {
    const properties = await this.propertyService.findAll();
    return {
      message: 'PROPERTY_RETRIEVED',
      user: req.user,
      data: properties,
    };
  }

  /**
   * Admin-only endpoint to create a property.
   * Requires: create:properties
   */
  @Post()
  @Permissions(Permission.CREATE_PROPERTIES)
  async create(@Body() dto: CreatePropertyDto, @Req() req: RequestWithUser) {
    const property = await this.propertyService.create(dto);
    return {
      message: 'PROPERTY_CREATED',
      user: req.user,
      data: property,
    };
  }
}
