import { Injectable } from '@nestjs/common';
import { LoginDto } from '@/presentation/dto/login.dto';
import { Role } from '@prisma/client';

interface ValidatedUser {
  id: string;
  email: string;
  role: Role;
}

interface LoginValidator {
  validate(email: string, password: string): Promise<ValidatedUser>;
}

interface JwtService {
  sign(payload: Record<string, string>): string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly validator: LoginValidator,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validator.validate(dto.email, dto.password);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
