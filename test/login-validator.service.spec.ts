import { LoginValidatorService } from '@/domain/services/login-validator.service';
import { Role } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@/domain/repositories/user.repository';
import * as bcrypt from 'bcryptjs';

describe('LoginValidatorService', () => {
  let service: LoginValidatorService;

  const mockUserRepository: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
  };

  beforeEach(() => {
    service = new LoginValidatorService(mockUserRepository);
    jest.clearAllMocks();
  });

  it('should return the user if the credentials are correct', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      id: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
      passwordHash: hashedPassword,
    });

    const result = await service.validate('demo@volsmart.com', 'password123');

    expect(result).toEqual({
      id: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
    });
  });

  it('should throw UnauthorizedException if the user does not exist', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);

    await expect(service.validate('notfound@volsmart.com', 'password123')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if the password is incorrect', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      id: 'user-id-123',
      email: 'demo@volsmart.com',
      role: Role.USER,
      passwordHash: hashedPassword,
    });

    await expect(service.validate('demo@volsmart.com', 'wrong-password')).rejects.toThrow(UnauthorizedException);
  });
});
