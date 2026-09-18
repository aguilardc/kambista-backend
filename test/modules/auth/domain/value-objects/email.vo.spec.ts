import { Email } from '@src/modules/auth/domain/value-objects/email.vo';
import { InvalidEmailException } from '@src/modules/auth/domain/exceptions/invalid-email.exception';

describe('Email Value Object', () => {
  it('debe crear la instancia si el correo es válido', () => {
    const email = new Email('test@kambista.com');
    expect(email.getValue).toBe('test@kambista.com');
  });

  it('debe lanzar InvalidEmailException si el formato es inválido', () => {
    expect(() => new Email('invalid-email')).toThrow(InvalidEmailException);
  });
});
