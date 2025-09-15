import { AppModule } from '@/app.module';
import { getServer } from './utils';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import jwt from 'jsonwebtoken';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('/auth/login (POST)', () => {
    const validUser = {
      email: 'admin@volsmart.io',
      password: 'Password123!',
    };

    it('should return access_token for valid credentials', async () => {
      const response = await request(getServer(app)).post('/auth/login').send(validUser).expect(200);

      const body = response.body as { access_token: string };

      expect(body).toHaveProperty('access_token');
      expect(typeof body.access_token).toBe('string');
      expect(body.access_token).toMatch(/^ey/);

      const decoded = jwt.decode(body.access_token) as jwt.JwtPayload;
      expect(decoded.email).toBe(validUser.email);
      expect(decoded.role).toBeDefined();
      expect(decoded.sub).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(getServer(app))
        .post('/auth/login')
        .send({
          email: validUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      const body = response.body as { message: string };
      expect(body.message).toBe('INVALID_CREDENTIALS');
    });

    it('should return 401 for unknown user', async () => {
      const response = await request(getServer(app))
        .post('/auth/login')
        .send({
          email: 'doesnotexist@volsmart.io',
          password: 'whatever',
        })
        .expect(401);

      const body = response.body as { message: string };
      expect(body.message).toBe('INVALID_CREDENTIALS');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(getServer(app))
        .post('/auth/login')
        .send({
          email: 'not-an-email',
          password: 'whatever',
        })
        .expect(400);

      const body = response.body as { message: string[] };
      expect(body.message[0]).toContain('email must be an email');
    });
  });
});
