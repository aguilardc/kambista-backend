import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '@src/modules/auth/infrastructure/adapters/in/auth.controller';
import { RegisterDto } from '@src/modules/auth/infrastructure/adapters/in/dtos/register.dto';
import { LoginDto } from '@src/modules/auth/infrastructure/adapters/in/dtos/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockRegisterUseCase: any;
  let mockLoginUseCase: any;

  beforeEach(() => {
    mockRegisterUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };
    mockLoginUseCase = {
      execute: vi.fn().mockResolvedValue({
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
      }),
    };

    controller = new AuthController(mockRegisterUseCase, mockLoginUseCase);
  });

  it('debe llamar al caso de uso de registro y retornar un mensaje de éxito', async () => {
    const dto: RegisterDto = {
      email: 'test@kambista.com',
      password: 'password',
      role: 'user',
    };

    const result = await controller.register(dto);

    expect(mockRegisterUseCase.execute).toHaveBeenCalledWith({
      email: dto.email,
      passwordStr: dto.password,
      roleStr: dto.role,
    });
    expect(result).toEqual({ message: 'Usuario registrado exitosamente' });
  });

  it('debe llamar al caso de uso de login y retornar los tokens', async () => {
    const dto: LoginDto = { email: 'test@kambista.com', password: 'password' };

    const result = await controller.login(dto);

    expect(mockLoginUseCase.execute).toHaveBeenCalledWith({
      email: dto.email,
      passwordStr: dto.password,
    });
    expect(result).toEqual({
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123',
    });
  });
});
