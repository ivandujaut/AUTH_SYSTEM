import { AppModule } from '@/app.module';
import { createToken, extractBody, getServer, ResponseBody } from './utils';
import { INestApplication } from '@nestjs/common';
import { Permission } from '@/domain/types/permissions';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('AdminController (e2e)', () => {
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

  it('should deny access to user management if user has no permissions', async () => {
    const token = createToken([]);
    const res = await request(getServer(app)).get('/admin/user-management').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('should allow access with "read:users" permission', async () => {
    const token = createToken([Permission.READ_USERS]);
    const res = await request(getServer(app)).get('/admin/user-management').set('Authorization', `Bearer ${token}`);
    const body = extractBody<ResponseBody>(res);
    expect(res.status).toBe(200);
    expect(body.user.permissions).toContain(Permission.READ_USERS);
  });

  it('should allow access with "write:users" permission', async () => {
    const token = createToken([Permission.WRITE_USERS]);
    const res = await request(getServer(app)).get('/admin/user-management').set('Authorization', `Bearer ${token}`);
    const body = extractBody<ResponseBody>(res);
    expect(res.status).toBe(200);
    expect(body.user.permissions).toContain(Permission.WRITE_USERS);
  });

  it('should allow access with both permissions', async () => {
    const token = createToken([Permission.READ_USERS, Permission.WRITE_USERS]);
    const res = await request(getServer(app)).get('/admin/user-management').set('Authorization', `Bearer ${token}`);
    const body = extractBody<ResponseBody>(res);
    expect(res.status).toBe(200);
    expect(body.user.permissions).toEqual(expect.arrayContaining([Permission.READ_USERS, Permission.WRITE_USERS]));
  });
});
