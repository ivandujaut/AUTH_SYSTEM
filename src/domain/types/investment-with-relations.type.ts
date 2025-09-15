import { Investment, Property, User } from '@prisma/client';

export type InvestmentWithRelations = Investment & {
  property: Property;
  owner: User;
};
