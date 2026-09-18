import { User } from '@src/modules/auth/domain/entities/user.entity';
import { Email } from '@src/modules/auth/domain/value-objects/email.vo';
import { Password } from '@src/modules/auth/domain/value-objects/password.vo';
import { Role } from '@src/modules/auth/domain/value-objects/role.vo';

describe('User Entity', () => {
  it('debe orquestar los Value Objects y exponer sus valores primitivos', () => {
    const user = new User(
      'uuid-123',
      new Email('user@kambista.com'),
      new Password('123456'),
      new Role('user'),
    );

    expect(user.getId).toBe('uuid-123');
    expect(user.getEmail).toBe('user@kambista.com');
    expect(user.getPassword).toBe('123456');
    expect(user.getRole).toBe('user');
    expect(user.isAdmin()).toBe(false);
  });

  it('debe actualizar la contraseña correctamente', () => {
    const user = new User(
      '1',
      new Email('a@a.com'),
      new Password('123456'),
      new Role('user'),
    );
    user.updatePassword(new Password('nueva-pass'));
    expect(user.getPassword).toBe('nueva-pass');
  });
});
