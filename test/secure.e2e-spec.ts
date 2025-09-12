import { AppModule } from '@/app.module';
import { extractBody, getServer, createToken, ResponseBody } from './utils';
import { INestApplication } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('SecureController (e2e) - Role-based Access', () => {
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

  it('should deny access to /secure/admin-only for USER role', async () => {
    const token = createToken([], Role.USER);

    const res = await request(getServer(app)).get('/secure/admin-only').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('should allow access to /secure/admin-only for ADMIN role', async () => {
    const token = createToken([], Role.ADMIN);

    const res = await request(getServer(app)).get('/secure/admin-only').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const body = extractBody<ResponseBody>(res);
    expect(body.user.role).toBe(Role.ADMIN);
  });

  it('should allow access to /secure/manager-or-admin for MANAGER role', async () => {
    const token = createToken([], Role.MANAGER);

    const res = await request(getServer(app)).get('/secure/manager-or-admin').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const body = extractBody<ResponseBody>(res);
    expect(body.user.role).toBe(Role.MANAGER);
  });

  it('should deny access to /secure/manager-or-admin for USER role', async () => {
    const token = createToken([], Role.USER);

    const res = await request(getServer(app)).get('/secure/manager-or-admin').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
