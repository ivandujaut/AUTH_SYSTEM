import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const hash = (pw: string): string => {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(pw, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  };

  await prisma.user.upsert({
    where: { email: 'admin@volsmart.io' },
    update: {},
    create: {
      email: 'admin@volsmart.io',
      passwordHash: hash('Password123!'),
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@volsmart.io' },
    update: {},
    create: {
      email: 'manager@volsmart.io',
      passwordHash: hash('Password123!'),
      role: 'MANAGER',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@volsmart.io' },
    update: {},
    create: {
      email: 'user@volsmart.io',
      passwordHash: hash('Password123!'),
      role: 'USER',
    },
  });

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
      {
        ownerId: manager.id,
        propertyId: re1.id,
        amount: 20,
        avgPrice: 99.5,
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
