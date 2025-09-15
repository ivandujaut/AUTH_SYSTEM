import { Role } from '@prisma/client';

export class InvestmentResponseDto {
  id: string;
  ownerId: string;
  propertyId: string;
  amount: number;
  avgPrice: number;
  createdAt: string;

  property: {
    symbol: string;
    name: string;
    navPrice: number;
    status: string;
  };

  owner: {
    id: string;
    email: string;
    role: Role;
  };
}
