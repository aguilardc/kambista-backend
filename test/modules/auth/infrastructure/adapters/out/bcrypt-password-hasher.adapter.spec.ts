import { describe, it, expect, vi } from 'vitest';
import { BcryptPasswordHasherAdapter } from '@src/modules/auth/infrastructure/adapters/out/bcrypt-password-hasher.adapter.service';
import * as bcrypt from 'bcrypt';

// Mock de la librería externa
vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('BcryptPasswordHasherAdapter', () => {
  const adapter = new BcryptPasswordHasherAdapter();

  it('debe encriptar la contraseña correctamente con 10 rondas', async () => {
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-pass' as never);

    const result = await adapter.hash('123456');

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(result).toBe('hashed-pass');
  });

  it('debe comparar la contraseña plana con el hash y retornar true si coinciden', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const result = await adapter.compare('123456', 'hashed-pass');

    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-pass');
    expect(result).toBe(true);
  });
});
