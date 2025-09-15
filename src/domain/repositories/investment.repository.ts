import { Investment } from '@prisma/client';
import { InvestmentWithRelations } from '@/domain/types/investment-with-relations.type';

export abstract class InvestmentRepository {
  abstract findAll(): Promise<InvestmentWithRelations[]>;
  abstract findByUserId(userId: string): Promise<InvestmentWithRelations[]>;
  abstract getUserInvestmentSummary(userId: string): Promise<InvestmentWithRelations[]>;
  abstract findByPropertyId(propertyId: string): Promise<InvestmentWithRelations[]>;
  abstract create(data: { propertyId: string; amount: number; avgPrice: number; ownerId: string }): Promise<Investment>;
}
