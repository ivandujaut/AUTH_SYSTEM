import { Investment } from '@prisma/client';

export abstract class InvestmentRepository {
  abstract create(data: { propertyId: string; amount: number; avgPrice: number; ownerId: string }): Promise<Investment>;
  abstract findAll(): Promise<Investment[]>;
  abstract findByUserId(userId: string): Promise<Investment[]>;
  abstract findByPropertyId(propertyId: string): Promise<Investment[]>;
}
