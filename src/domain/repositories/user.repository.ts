import { Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
}
