import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const createToken = (role: Role): string => {
  const payload = {
    sub: 'test-user-id',
    email: 'test@volsmart.com',
    role,
  };

  return jwt.sign(payload, 'TEST_SECRET', { expiresIn: '1h' });
};
