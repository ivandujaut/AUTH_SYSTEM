import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { getServer, extractBody, createToken } from './utils';
import { INestApplication } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import jwt from 'jsonwebtoken';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should respond with 200 and expected message', async () => {
    const res = await request(getServer(app)).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('NestJS + TypeScript Server');
  });

  it('should allow access to /auth/protected with ADMIN role', async () => {
    const token = createToken(Role.ADMIN);

    const res = await request(getServer(app)).get('/auth/protected').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const body = extractBody(res);
    expect(body.user.role).toBe(Role.ADMIN);
  });

  it('should deny access to /auth/protected with USER role', async () => {
    const token = createToken(Role.USER);

    const res = await request(getServer(app)).get('/auth/protected').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('SecureController (e2e)', () => {
  let app: INestApplication;

  const createToken = (role: Role): string => {
    return jwt.sign(
      {
        sub: 'user-123',
        email: 'demo@volsmart.com',
        role,
      },
      'TEST_SECRET',
      { expiresIn: '1h' },
    );
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

  it('should deny access to /secure/admin-only for USER role', async () => {
    const token = createToken(Role.USER);
    const res = await request(getServer(app)).get('/secure/admin-only').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('should allow access to /secure/admin-only for ADMIN role', async () => {
    const token = createToken(Role.ADMIN);
    const res = await request(getServer(app)).get('/secure/admin-only').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = extractBody(res);
    expect(body.user.role).toBe(Role.ADMIN);
  });

  it('should allow access to /secure/manager-or-admin for MANAGER role', async () => {
    const token = createToken(Role.MANAGER);
    const res = await request(getServer(app)).get('/secure/manager-or-admin').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = extractBody(res);
    expect(body.user.role).toBe(Role.MANAGER);
  });

  it('should deny access to /secure/manager-or-admin for USER role', async () => {
    const token = createToken(Role.USER);
    const res = await request(getServer(app)).get('/secure/manager-or-admin').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
