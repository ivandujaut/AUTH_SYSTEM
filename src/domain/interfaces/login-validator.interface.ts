import { Role } from '@prisma/client';

export interface ValidatedUser {
  id: string;
  email: string;
  role: Role;
}

export interface LoginValidator {
  validate(email: string, password: string): Promise<ValidatedUser>;
}

export const LoginValidatorToken = Symbol('LoginValidator');
