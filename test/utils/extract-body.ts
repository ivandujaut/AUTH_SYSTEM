import { Permission } from '@/domain/types/permissions';
import { Role } from '@prisma/client';

export type ResponseBody = {
  message: string;
  user: {
    sub: string;
    email: string;
    role: Role;
    permissions: Permission[];
  };
};

export function extractBody<T>(res: { body: unknown }): T {
  return res.body as T;
}
