import { Injectable } from '@nestjs/common';
import { InvestmentRepository } from '../repositories/investment.repository';
import { CreateInvestmentDto } from '@/presentation/dto/create-investment.dto';
import { Investment } from '@prisma/client';

@Injectable()
export class InvestmentService {
  constructor(private readonly investmentRepo: InvestmentRepository) {}

  async create(dto: CreateInvestmentDto): Promise<Investment> {
    return this.investmentRepo.create(dto);
  }

  async findAll(): Promise<Investment[]> {
    return this.investmentRepo.findAll();
  }

  async findByUserId(userId: string): Promise<Investment[]> {
    return this.investmentRepo.findByUserId(userId);
  }

  async findByPropertyId(propertyId: string): Promise<Investment[]> {
    return this.investmentRepo.findByPropertyId(propertyId);
  }
}
