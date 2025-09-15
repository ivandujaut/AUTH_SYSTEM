import { CreateInvestmentDto } from '@/presentation/dto/create-investment.dto';
import { Injectable } from '@nestjs/common';
import { Investment } from '@prisma/client';
import { InvestmentRepository } from '../repositories/investment.repository';
import { InvestmentWithRelations } from '../types/investment-with-relations.type';

@Injectable()
export class InvestmentService {
  constructor(private readonly investmentRepo: InvestmentRepository) {}

  async create(dto: CreateInvestmentDto & { ownerId: string }): Promise<Investment> {
    return this.investmentRepo.create(dto);
  }

  async findAll(): Promise<InvestmentWithRelations[]> {
    return this.investmentRepo.findAll();
  }

  async findByUserId(userId: string): Promise<InvestmentWithRelations[]> {
    return this.investmentRepo.findByUserId(userId);
  }

  async findByPropertyId(propertyId: string): Promise<InvestmentWithRelations[]> {
    return this.investmentRepo.findByPropertyId(propertyId);
  }

  async getUserInvestmentSummary(userId: string): Promise<InvestmentWithRelations[]> {
    return this.investmentRepo.getUserInvestmentSummary(userId);
  }
}
