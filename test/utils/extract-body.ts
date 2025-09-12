import { Role } from '@prisma/client';
import { Response } from 'supertest';

export type ResponseBody = {
  message: string;
  user: {
    sub: string;
    email: string;
    role: Role;
  };
};

export const extractBody = (res: Response): ResponseBody => res.body as ResponseBody;
