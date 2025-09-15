import { JwtPayload } from '@/domain/types/jwt-payload.interface';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

export function createToken(role: Role = Role.USER): string {
  const payload: JwtPayload = {
    sub: 'user-123',
    email: 'demo@volsmart.com',
    role,
  };

  return jwt.sign(payload, 'TEST_SECRET', { expiresIn: '1h' });
}
