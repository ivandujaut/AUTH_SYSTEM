import { Controller, Get, Post, Body, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateInvestmentDto } from '@/presentation/dto/create-investment.dto';
import { InvestmentService } from '@/domain/services/investment.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Permission } from '@/domain/types/permissions';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import type { RequestWithUser } from '@/domain/types/request-with-user.interface';
import { InvestmentMapper } from '@/domain/mappers/investment.mapper';

@Controller('investments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Get()
  @Permissions(Permission.VIEW_ALL_INVESTMENTS)
  async findAll(@Req() req: RequestWithUser) {
    const investments = await this.investmentService.findAll();
    const grouped = InvestmentMapper.toList(investments, { groupByOwner: true });

    return {
      message: 'INVESTMENTS_RETRIEVED',
      user: req.user,
      data: grouped,
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
  async findByProperty(@Param('propertyId') propertyId: string, @Req() req: RequestWithUser) {
    const investments = await this.investmentService.findByPropertyId(propertyId);
    const grouped = InvestmentMapper.toList(investments, { groupByOwner: true });

    return {
      message: 'INVESTMENTS_BY_PROPERTY_RETRIEVED',
      user: req.user,
      data: grouped,
    };
  }

  @Get('me/summary')
  @Permissions(Permission.VIEW_MY_INVESTMENTS)
  async getMyInvestmentsSummary(@Req() req: RequestWithUser) {
    console.log('✅ [GET /investments/me/summary] endpoint reached');
    const userId = req.user.sub;
    const investments = await this.investmentService.findByUserId(userId);
    const summary = InvestmentMapper.toSummary(investments);

    return {
      message: 'MY_INVESTMENTS_SUMMARY_RETRIEVED',
      data: summary,
    };
  }

  @Get('me')
  @Permissions(Permission.VIEW_MY_INVESTMENTS)
  async findMyInvestments(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    const investments = await this.investmentService.findByUserId(userId);
    const mapped = InvestmentMapper.toListForMe(investments);

    return {
      message: 'MY_INVESTMENTS_RETRIEVED',
      data: mapped,
    };
  }

  @Post()
  @Permissions(Permission.INVEST)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInvestmentDto, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const investment = await this.investmentService.create({
      ...dto,
      ownerId,
    });

    return {
      message: 'INVESTMENT_CREATED',
      user: req.user,
      data: investment,
    };
  }
}
