import { AppModule } from '@/app.module';
import { getServer, createToken, extractBody, ResponseBody } from './utils';
import { INestApplication } from '@nestjs/common';
import { Investment } from '@prisma/client';
import { Permission } from '@/domain/types/permissions';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /investments', () => {
    it('should deny access without permission', async () => {
      const token = createToken([]);

      const res = await request(getServer(app)).get('/investments').set('Authorization', `Bearer ${token}`);
      const body = res.body as ResponseBody<unknown>;

      expect(res.status).toBe(403);
      expect(body.message).toBe('INSUFFICIENT_PERMISSIONS');
    });

    it('should return investments with permission', async () => {
      const token = createToken([Permission.VIEW_ALL_INVESTMENTS]);

      const res = await request(getServer(app)).get('/investments').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      const body = extractBody<ResponseBody<Investment[]>>(res);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('POST /investments', () => {
    it('should deny creation without INVEST permission', async () => {
      const token = createToken([]);

      const res = await request(getServer(app))
        .post('/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(investmentPayload);

      const body = res.body as ResponseBody<unknown>;
      expect(res.status).toBe(403);
      expect(body.message).toBe('INSUFFICIENT_PERMISSIONS');
    });

    it('should allow creation with INVEST permission', async () => {
      const token = createToken([Permission.INVEST]);

      const res = await request(getServer(app))
        .post('/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(investmentPayload);

      expect(res.status).toBe(201);
      const body = extractBody<ResponseBody<Investment>>(res);
      expect(body.message).toBe('INVESTMENT_CREATED');
      expect(body.data.ownerId).toBe(investmentPayload.ownerId);
    });
  });
});
