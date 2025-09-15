import { Investment, Property, User } from '@prisma/client';

type InvestmentWithRelations = Investment & {
  property: Property;
  owner: User;
};

type MappedInvestment = ReturnType<typeof InvestmentMapper.toResponse>;

type OwnerGroup = {
  owner: {
    id: string;
    email: string;
    role: string;
  };
  investments: Omit<MappedInvestment, 'owner'>[];
};

export class InvestmentMapper {
  static toResponse(investment: InvestmentWithRelations) {
    return {
      id: investment.id,
      ownerId: investment.ownerId,
      propertyId: investment.propertyId,
      amount: investment.amount,
      avgPrice: investment.avgPrice,
      createdAt: investment.createdAt,
      property: {
        symbol: investment.property.symbol,
        name: investment.property.name,
        navPrice: investment.property.navPrice,
        status: investment.property.status,
      },
      owner: {
        id: investment.owner.id,
        email: investment.owner.email,
        role: investment.owner.role,
      },
    };
  }

  static toList(
    investments: InvestmentWithRelations[],
    options?: { groupByOwner?: boolean },
  ): MappedInvestment[] | OwnerGroup[] {
    if (options?.groupByOwner) {
      const grouped = new Map<string, OwnerGroup>();

      for (const inv of investments) {
        const full = this.toResponse(inv);
        const { owner, ...investmentWithoutOwner } = full;

        if (!grouped.has(owner.id)) {
          grouped.set(owner.id, {
            owner,
            investments: [investmentWithoutOwner],
          });
        } else {
          grouped.get(owner.id)?.investments.push(investmentWithoutOwner);
        }
      }

      return Array.from(grouped.values());
    }

    return investments.map((inv) => this.toResponse(inv));
  }

  static toListForMe(investments: InvestmentWithRelations[]): Omit<MappedInvestment, 'owner' | 'ownerId'>[] {
    return investments.map((inv) => {
      const full = this.toResponse(inv);
      delete full.owner;
      delete full.ownerId;
      return full;
    });
  }
}
