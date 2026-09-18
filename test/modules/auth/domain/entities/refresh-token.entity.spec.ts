import { RefreshToken } from '@src/modules/auth/domain/entities/refresh-token.entity';

describe('RefreshToken Entity', () => {
  it('debe ser válido si no ha expirado y no está revocado', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    const token = new RefreshToken('1', 'token-abc', 'user-1', futureDate);

    expect(token.isValid()).toBe(true);
  });

  it('debe ser inválido si la fecha de expiración ya pasó', () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1);
    const token = new RefreshToken('1', 'token-abc', 'user-1', pastDate);

    expect(token.isValid()).toBe(false);
  });

  it('debe ser inválido tras ser revocado mediante el método de negocio', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    const token = new RefreshToken('1', 'token-abc', 'user-1', futureDate);

    token.revoke();
    expect(token.isValid()).toBe(false);
  });
});
