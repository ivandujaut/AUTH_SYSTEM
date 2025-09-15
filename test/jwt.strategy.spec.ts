import { JwtStrategy } from '@/presentation/jwt.strategy';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'TEST_SECRET';
        return null;
      }),
    };

    strategy = new JwtStrategy(mockConfigService as ConfigService);
  });

  it('should return the full payload as req.user', () => {
    const payload = {
      sub: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
    };

    const result = strategy.validate(payload);

    expect(result).toEqual(payload);
  });
});
