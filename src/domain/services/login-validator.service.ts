import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginValidatorService {
  constructor(private readonly prisma: PrismaClient) {}

  async validate(email: string, password: string): Promise<{ id: string; email: string; role: Role }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
