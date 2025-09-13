import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateInvestmentDto } from '@/presentation/dto/create-investment.dto';
import { InvestmentService } from '@/domain/services/investment.service';
import { Permissions } from '../decorators/permissions.decorator';
import { Permission } from '@/domain/types/permissions';
import { RolesGuard } from '../guards/roles.guard';

@Controller('investments')
@UseGuards(RolesGuard)
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Get()
  @Permissions(Permission.VIEW_ALL_INVESTMENTS)
  async findAll() {
    const investments = await this.investmentService.findAll();
    return {
      message: 'INVESTMENTS_RETRIEVED',
      data: investments,
    };
  }

  @Get('user/:userId')
  @Permissions(Permission.VIEW_ALL_INVESTMENTS)
  async findByUser(@Param('userId') userId: string) {
    const investments = await this.investmentService.findByUserId(userId);
    return {
      message: 'INVESTMENTS_BY_USER_RETRIEVED',
      data: investments,
    };
  }

  @Get('property/:propertyId')
  @Permissions(Permission.VIEW_ALL_INVESTMENTS)
  async findByProperty(@Param('propertyId') propertyId: string) {
    const investments = await this.investmentService.findByPropertyId(propertyId);
    return {
      message: 'INVESTMENTS_BY_PROPERTY_RETRIEVED',
      data: investments,
    };
  }

  @Post()
  @Permissions(Permission.INVEST)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInvestmentDto) {
    const investment = await this.investmentService.create(dto);
    return {
      message: 'INVESTMENT_CREATED',
      data: investment,
    };
  }
}
