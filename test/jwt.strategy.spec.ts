import { JwtStrategy } from '@/presentation/jwt.strategy';
import { Role } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should return the full payload as req.user', () => {
    const payload = {
      sub: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
    };

    const result = strategy.validate(payload);

    expect(result).toEqual({
      sub: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
    });
  });
});
