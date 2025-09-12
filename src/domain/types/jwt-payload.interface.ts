import { Role } from '@prisma/client';
import { Permission } from './permissions';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  permissions?: Permission[];
}
