import { AppModule } from '@/app.module';
import { createToken, extractBody, getServer, ResponseBody } from './utils';
import { INestApplication } from '@nestjs/common';
import { Permission } from '@/domain/types/permissions';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('DashboardController (e2e)', () => {
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

  it('should deny access to dashboard if user lacks permission', async () => {
    const token = createToken([]);

    const res = await request(getServer(app)).get('/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('should allow access to dashboard if user has permission', async () => {
    const token = createToken([Permission.VIEW_DASHBOARD]);

    const res = await request(getServer(app)).get('/dashboard').set('Authorization', `Bearer ${token}`);

    const body = extractBody<ResponseBody>(res);

    expect(body.message).toBe('Dashboard access granted');
    expect(body.user.permissions).toContain('view_dashboard');
  });
});
