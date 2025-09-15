import { AppModule } from '@/app.module';
import { getServer, extractBody, createToken, ResponseBody } from './utils';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Property, Role } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('PropertiesController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const newProperty = {
    symbol: `TEST-${Date.now()}`,
    name: 'Test Project',
    navPrice: 100,
  };

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
    await prisma.property.deleteMany({
      where: { symbol: { startsWith: 'TEST-' } },
    });
    await prisma.$disconnect();
  });
  it('should return properties with manager role', async () => {
    const token = createToken(Role.MANAGER);

    const res = await request(getServer(app)).get('/properties').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const body = extractBody<ResponseBody<Property[]>>(res);
    expect(body.message).toBe('PROPERTY_RETRIEVED');
    expect(Array.isArray(body.data)).toBe(true);
  });
  it('should deny access without create permission', async () => {
    const token = createToken(Role.USER);

    const res = await request(getServer(app))
      .post('/properties')
      .set('Authorization', `Bearer ${token}`)
      .send(newProperty);

    expect(res.status).toBe(403);
  });
  it('should create property with manager role', async () => {
    const token = createToken(Role.ADMIN);

    const res = await request(getServer(app))
      .post('/properties')
      .set('Authorization', `Bearer ${token}`)
      .send(newProperty);

    expect(res.status).toBe(201);

    const body = extractBody<ResponseBody<Property>>(res);
    expect(body.message).toBe('PROPERTY_CREATED');
    expect(body.data.name).toBe(newProperty.name);
    expect(body.data.symbol).toBe(newProperty.symbol);
    expect(parseFloat(body.data.navPrice.toString())).toBe(newProperty.navPrice);
  });
});
