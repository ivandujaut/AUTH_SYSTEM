import { Investment, Property, User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

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

  static toSummary(investments: InvestmentWithRelations[]) {
    const propertyMap = new Map<
      string,
      {
        id: string;
        symbol: string;
        name: string;
        navPrice: Decimal;
        status: string;
        totalAmount: Decimal;
        totalInvested: Decimal;
      }
    >();

    let totalInvested = new Decimal(0);
    let weightedSum = new Decimal(0);
    let totalTokens = new Decimal(0);

    for (const inv of investments) {
      const amount = new Decimal(inv.amount);
      const avgPrice = new Decimal(inv.avgPrice);
      const investedAmount = amount.mul(avgPrice);

      totalInvested = totalInvested.add(investedAmount);
      totalTokens = totalTokens.add(amount);
      weightedSum = weightedSum.add(avgPrice.mul(amount));

      const propId = inv.property.id;

      if (!propertyMap.has(propId)) {
        propertyMap.set(propId, {
          id: inv.property.id,
          symbol: inv.property.symbol,
          name: inv.property.name,
          navPrice: inv.property.navPrice,
          status: inv.property.status,
          totalAmount: amount,
          totalInvested: investedAmount,
        });
      } else {
        const existing = propertyMap.get(propId);
        if (!existing) continue;
        existing.totalAmount = existing.totalAmount.add(amount);
        existing.totalInvested = existing.totalInvested.add(investedAmount);
      }
    }

    const properties = Array.from(propertyMap.values()).map((p) => ({
      id: p.id,
      symbol: p.symbol,
      name: p.name,
      navPrice: p.navPrice.toString(),
      status: p.status,
      totalAmount: p.totalAmount.toString(),
      totalInvested: p.totalInvested.toString(),
    }));

    return {
      totalInvested: totalInvested.toString(),
      averagePrice: totalTokens.gt(0) ? weightedSum.div(totalTokens).toFixed(2) : '0',
      totalProperties: propertyMap.size,
      properties,
    };
  }
}
