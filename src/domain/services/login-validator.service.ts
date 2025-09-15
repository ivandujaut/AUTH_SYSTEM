import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import { LoginValidator, ValidatedUser } from '../interfaces/login-validator.interface';

@Injectable()
export class LoginValidatorService implements LoginValidator {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(email: string, password: string): Promise<ValidatedUser> {
    const user = await this.userRepository.findByEmail(email);

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
