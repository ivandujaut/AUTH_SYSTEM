import { LoginValidatorService } from '@/domain/services/login-validator.service';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('LoginValidatorService', () => {
  let service: LoginValidatorService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  } as unknown as PrismaClient;

  beforeEach(() => {
    service = new LoginValidatorService(mockPrisma);
  });

  /* eslint-disable @typescript-eslint/unbound-method */
  it('debería devolver el usuario si las credenciales son correctas', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const findUniqueMock = mockPrisma.user.findUnique as jest.Mock;
    findUniqueMock.mockResolvedValueOnce({
      id: 'user-id-123',
      email: 'demo@volsmart.com',
      passwordHash: hashedPassword,
    });

    const result = await service.validate('demo@volsmart.com', 'password123');

    expect(result).toEqual({
      id: 'user-id-123',
      email: 'demo@volsmart.com',
    });
  });
});
