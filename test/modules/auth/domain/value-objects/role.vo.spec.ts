import {
  Role,
  ValidRoles,
} from '@src/modules/auth/domain/value-objects/role.vo';
import { InvalidRoleException } from '@src/modules/auth/domain/exceptions/invalid-role.exception';

describe('Role Value Object', () => {
  it('debe crear la instancia si el rol es user o admin', () => {
    expect(new Role('user').getValue).toBe(ValidRoles.USER);
    expect(new Role('admin').getValue).toBe(ValidRoles.ADMIN);
  });

  it('debe lanzar InvalidRoleException si el rol no es válido', () => {
    expect(() => new Role('superadmin')).toThrow(InvalidRoleException);
  });

  it('isAdmin() debe retornar true solo si el rol es admin', () => {
    expect(new Role('admin').isAdmin()).toBe(true);
    expect(new Role('user').isAdmin()).toBe(false);
  });
});
