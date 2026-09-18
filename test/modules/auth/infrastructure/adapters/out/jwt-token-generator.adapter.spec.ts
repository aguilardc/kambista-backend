import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JwtTokenGeneratorAdapter } from '@src/modules/auth/infrastructure/adapters/out/jwt-token-generator.adapter.service';
import { JwtService } from '@nestjs/jwt';

describe('JwtTokenGeneratorAdapter', () => {
  let adapter: JwtTokenGeneratorAdapter;
  let mockJwtService: any;

  beforeEach(() => {
    mockJwtService = {
      sign: vi.fn(),
    };
    adapter = new JwtTokenGeneratorAdapter(mockJwtService as JwtService);
  });

  it('debe generar un access token con expiración de 15m y el rol', () => {
    mockJwtService.sign.mockReturnValue('access-token');

    const token = adapter.generateAccessToken('user-1', 'admin');

    expect(mockJwtService.sign).toHaveBeenCalledWith(
      { sub: 'user-1', role: 'admin' },
      { expiresIn: '15m' },
    );
    expect(token).toBe('access-token');
  });

  it('debe generar un refresh token con expiración de 7d sin el rol', () => {
    mockJwtService.sign.mockReturnValue('refresh-token');

    const token = adapter.generateRefreshToken('user-1');

    expect(mockJwtService.sign).toHaveBeenCalledWith(
      { sub: 'user-1' },
      { expiresIn: '7d' },
    );
    expect(token).toBe('refresh-token');
  });
});
