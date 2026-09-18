import { Password } from '@src/modules/auth/domain/value-objects/password.vo';
import { InvalidPasswordException } from '@src/modules/auth/domain/exceptions/invalid-password.exception';

describe('Password Value Object', () => {
  it('debe crear la instancia si la contraseña tiene 6 o más caracteres', () => {
    const password = new Password('123456');
    expect(password.getValue).toBe('123456');
  });

  it('debe lanzar InvalidPasswordException si tiene menos de 6 caracteres', () => {
    expect(() => new Password('12345')).toThrow(InvalidPasswordException);
  });

  it('debe omitir la validación si la contraseña ya está encriptada (isHashed = true)', () => {
    const hashedPassword = new Password('hash-generado-por-bcrypt', true);
    expect(hashedPassword.getValue).toBe('hash-generado-por-bcrypt');
  });
});
