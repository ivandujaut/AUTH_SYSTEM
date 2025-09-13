import { Injectable } from '@nestjs/common';
import { InvestmentRepository } from '@/domain/repositories/investment.repository';
import { PrismaClient, Investment } from '@prisma/client';

@Injectable()
export class PrismaInvestmentRepository implements InvestmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { propertyId: string; amount: number; avgPrice: number; ownerId: string }): Promise<Investment> {
    return this.prisma.investment.create({ data });
  }

  async findAll(): Promise<Investment[]> {
    return this.prisma.investment.findMany({
      include: {
        property: true,
        owner: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Investment[]> {
    return this.prisma.investment.findMany({
      where: { ownerId: userId },
      include: {
        property: true,
      },
    });
  }

  async findByPropertyId(propertyId: string): Promise<Investment[]> {
    return this.prisma.investment.findMany({
      where: { propertyId },
      include: {
        property: true,
      },
    });
  }
}
