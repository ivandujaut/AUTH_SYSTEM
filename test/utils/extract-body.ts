import { Permission } from '@/domain/types/permissions';
import { Role } from '@prisma/client';

export type ResponseBody<T = unknown> = {
  message: string;
  user: {
    sub: string;
    email: string;
    role: Role;
    permissions: Permission[];
  };
  data?: T;
};

export function extractBody<T>(res: { body: unknown }): T {
  return res.body as T;
}
