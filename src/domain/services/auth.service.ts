import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type LoginValidator, LoginValidatorToken } from '@/domain/interfaces/login-validator.interface';
import { LoginDto } from '@/presentation/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(LoginValidatorToken)
    private readonly validator: LoginValidator,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validator.validate(dto.email, dto.password);
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: token };
  }
}
