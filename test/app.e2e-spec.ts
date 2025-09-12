import { AppModule } from '@/app.module';
import { getServer } from './utils';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
});
