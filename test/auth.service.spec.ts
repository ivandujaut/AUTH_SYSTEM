import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/domain/services/auth.service';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;

  const mockValidator = {
    validate: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn((payload: Record<string, string>) => jwt.sign(payload, 'test-secret', { expiresIn: '1h' })),
  };

  beforeEach(() => {
    mockValidator.validate.mockReset();
    mockJwtService.sign.mockClear();
    service = new AuthService(mockValidator as any, mockJwtService as any);
  });

  it('Should return a valid access token when email and pass are correct', async () => {
    mockValidator.validate.mockResolvedValueOnce({ id: 'user-id-123', email: 'demo@volsmart.com', role: 'USER' });

    const result = await service.login({
      email: 'demo@volsmart.com',
      password: 'password123',
    });

    expect(typeof result.access_token).toBe('string');
    expect(result.access_token).toMatch(/^ey/);
  });
  it('Should throw UnauthorizedException when credentials are invalid', async () => {
    mockValidator.validate.mockRejectedValueOnce(new UnauthorizedException('INVALID_CREDENTIALS'));

    await expect(
      service.login({
        email: 'wrong@volsmart.com',
        password: 'incorrect-password',
      }),
    ).rejects.toMatchObject({
      name: 'UnauthorizedException',
      message: 'INVALID_CREDENTIALS',
    });
  });
  it('should return a token with the correct claims', async () => {
    mockValidator.validate.mockResolvedValueOnce({
      id: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
    });

    const { access_token } = await service.login({
      email: 'demo@volsmart.com',
      password: 'password123',
    });

    const decoded = jwt.decode(access_token) as {
      sub: string;
      email: string;
      role: Role;
      iat: number;
    };

    expect(decoded.sub).toBe('user-id-123');
    expect(decoded.email).toBe('demo@volsmart.com');
    expect(decoded.role).toBe(Role.USER);
    expect(typeof decoded.iat).toBe('number');
  });
});
