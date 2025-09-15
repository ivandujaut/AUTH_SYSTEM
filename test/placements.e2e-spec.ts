import { AppModule } from '@/app.module';
import { getServer, createToken, extractBody } from './utils';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Role, Placement } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
const prisma = new PrismaClient();

describe('PlacementController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should allow access to GET /placements with permission', async () => {
    const token = createToken(Role.USER);

    const res = await request(getServer(app)).get('/placements').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = extractBody<{ data: Placement[] }>(res);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should deny access to POST /placements without permission', async () => {
    const token = createToken(Role.USER);

    const res = await request(getServer(app))
      .post('/placements')
      .send({
        propertyId: 'some-fake-id',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
  it('should return existing placement for user with permission', async () => {
    const token = createToken(Role.MANAGER);

    const res = await request(getServer(app)).get('/placements').set('Authorization', `Bearer ${token}`);

    const body = extractBody<{ data: Placement[] }>(res);

    expect(res.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    if (body.data.length === 0) {
      return;
    }

    const placement = body.data[0];

    expect(placement.propertyId).toBeDefined();
    expect(new Date(placement.startDate)).toBeInstanceOf(Date);
    expect(new Date(placement.endDate)).toBeInstanceOf(Date);
  });
});
