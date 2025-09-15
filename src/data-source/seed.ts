import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = async (pw: string): Promise<string> => {
    return await bcrypt.hash(pw, 10);
  };

  // ADMIN
  await prisma.user.upsert({
    where: { email: 'admin@volsmart.io' },
    update: {},
    create: {
      email: 'admin@volsmart.io',
      passwordHash: await hash('Password123!'),
      role: 'ADMIN',
    },
  });

  // MANAGER
  await prisma.user.upsert({
    where: { email: 'manager@volsmart.io' },
    update: {},
    create: {
      email: 'manager@volsmart.io',
      passwordHash: await hash('Password123!'),
      role: 'MANAGER',
    },
  });

  // USER
  const user = await prisma.user.upsert({
    where: { email: 'user@volsmart.io' },
    update: {},
    create: {
      email: 'user@volsmart.io',
      passwordHash: await hash('Password123!'),
      role: 'USER',
    },
  });

  // PROPERTIES
  const re1 = await prisma.property.upsert({
    where: { symbol: 'VLS-RE1' },
    update: {},
    create: {
      symbol: 'VLS-RE1',
      name: 'Torre Norte',
      navPrice: 100.0,
    },
  });

  const re2 = await prisma.property.upsert({
    where: { symbol: 'VLS-RE2' },
    update: {},
    create: {
      symbol: 'VLS-RE2',
      name: 'Parque Central',
      navPrice: 80.5,
    },
  });

  // PLACEMENT para VLS-RE1
  await prisma.placement.upsert({
    where: { propertyId: re1.id },
    update: {},
    create: {
      propertyId: re1.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días
    },
  });

  // INVESTMENTS
  await prisma.investment.createMany({
    data: [
      {
        ownerId: user.id,
        propertyId: re1.id,
        amount: 150,
        avgPrice: 100,
      },
      {
        ownerId: user.id,
        propertyId: re2.id,
        amount: 50,
        avgPrice: 80.5,
      },
    ],
  });

  console.log('✅ Seed completed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
