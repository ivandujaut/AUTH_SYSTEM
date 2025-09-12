import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from '@/presentation/guards/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    guard = new RolesGuard(reflector);
  });

  const mockContext = (role: Role): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role },
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    }) as unknown as ExecutionContext;

  it('should allow access if user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([Role.ADMIN]);

    const context = mockContext(Role.ADMIN);
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
  it('should deny access if user lacks required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([Role.MANAGER]);

    const context = mockContext(Role.USER);
    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });
  it('should allow access if no roles are required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const context = mockContext(Role.USER);
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});
