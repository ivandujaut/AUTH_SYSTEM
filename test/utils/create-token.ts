import { JwtPayload } from '@/domain/types/jwt-payload.interface';
import { Permission } from '@/domain/types/permissions';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

export function createToken(permissions: Permission[] = [], role: Role = Role.USER): string {
  const payload: JwtPayload = {
    sub: 'user-123',
    email: 'demo@volsmart.com',
    role,
    permissions,
  };

  return jwt.sign(payload, 'TEST_SECRET', { expiresIn: '1h' });
}
