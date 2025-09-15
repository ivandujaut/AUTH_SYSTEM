import { AuthService } from '@/domain/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginValidatorService } from '@/domain/services/login-validator.service';
import { Role } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockValidator: Partial<LoginValidatorService> = {
    validate: jest.fn(),
  };

  const mockJwtService: Partial<JwtService> = {
    sign: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(mockValidator as LoginValidatorService, mockJwtService as JwtService);
  });

  it('should return an access token when credentials are valid', async () => {
    const user = {
      id: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
    };

    (mockValidator.validate as jest.Mock).mockResolvedValue(user);
    (mockJwtService.sign as jest.Mock).mockReturnValue('fake-jwt-token');

    const result = await service.login({
      email: 'demo@volsmart.com',
      password: 'password123',
    });

    expect(result.access_token).toBe('fake-jwt-token');
    expect(mockValidator.validate).toHaveBeenCalledWith('demo@volsmart.com', 'password123');
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    (mockValidator.validate as jest.Mock).mockRejectedValue(new UnauthorizedException('INVALID_CREDENTIALS'));

    await expect(
      service.login({
        email: 'invalid@user.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockValidator.validate).toHaveBeenCalled();
  });
});
