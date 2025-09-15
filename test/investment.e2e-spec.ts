import { PrismaClient, Role } from '@prisma/client';
import { AppModule } from '@/app.module';
import { getServer, createToken, extractBody, ResponseBody } from './utils';
import { INestApplication } from '@nestjs/common';
import { Investment } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

const prisma = new PrismaClient();

const investmentPayload = {
  ownerId: 'user-1',
  propertyId: 'property-1',
  amount: 100,
  avgPrice: 90,
};

describe('InvestmentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await prisma.property.create({
      data: {
        id: 'property-1',
        symbol: 'TEST-E2E',
        name: 'Investment Test Property',
        navPrice: 100,
        description: 'Test property',
        status: 'ACTIVE',
      },
    });

    await prisma.user.create({
      data: {
        id: 'TEST-1',
        email: 'test@user.com',
        passwordHash: 'hashed',
        role: 'USER',
        status: 'ACTIVE',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.property.deleteMany({
      where: { symbol: { startsWith: 'TEST-' } },
    });
    await prisma.user.deleteMany({
      where: { id: { startsWith: 'TEST-' } },
    });
    await prisma.$disconnect();
  });

  it('should deny access without permission', async () => {
    const token = createToken(Role.USER);

    const res = await request(getServer(app)).get('/investments').set('Authorization', `Bearer ${token}`);
    const body = res.body as ResponseBody<unknown>;

    expect(res.status).toBe(403);
    expect(body.message).toBe('FORBIDDEN_RESOURCE');
  });

  it('should return investments with permission', async () => {
    const token = createToken(Role.MANAGER);

    const res = await request(getServer(app)).get('/investments').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = extractBody<ResponseBody<Investment[]>>(res);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should deny creation without INVEST permission', async () => {
    const token = createToken(Role.MANAGER);

    const res = await request(getServer(app))
      .post('/investments')
      .set('Authorization', `Bearer ${token}`)
      .send(investmentPayload);

    const body = res.body as ResponseBody<unknown>;
    expect(res.status).toBe(403);
    expect(body.message).toBe('FORBIDDEN_RESOURCE');
  });
});
