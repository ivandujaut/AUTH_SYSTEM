import { Roles } from '@/presentation/decorators/roles.decorator';
import { Role } from '@prisma/client';

describe('Roles Decorator', () => {
  it('should set roles metadata on handler', () => {
    class TestClass {
      @Roles(Role.ADMIN, Role.MANAGER)
      testMethod(this: void): void {}
    }

    const roles = Reflect.getMetadata('roles', TestClass.prototype.testMethod) as Role[];

    expect(roles).toEqual([Role.ADMIN, Role.MANAGER]);
  });
});
