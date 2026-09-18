import { LoginUseCaseService } from '@src/modules/auth/application/use-cases/login.use-case.service';
import { InvalidCredentialsException } from '@src/modules/auth/domain/exceptions/invalid-credentials.exception';
import { User } from '@src/modules/auth/domain/entities/user.entity';
import { Email } from '@src/modules/auth/domain/value-objects/email.vo';
import { Password } from '@src/modules/auth/domain/value-objects/password.vo';
import { Role } from '@src/modules/auth/domain/value-objects/role.vo';

describe('LoginUseCaseService', () => {
  let loginUseCase: LoginUseCaseService;
  let mockUserRepository: any;
  let mockPasswordHasher: any;
  let mockTokenGenerator: any;

  const validUser = new User(
    'uuid-123',
    new Email('test@kambista.com'),
    new Password('hashed-password', true),
    new Role('user'),
  );

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
    };
    mockPasswordHasher = {
      compare: vi.fn(),
    };
    mockTokenGenerator = {
      generateAccessToken: vi.fn().mockReturnValue('access-token-123'),
      generateRefreshToken: vi.fn().mockReturnValue('refresh-token-123'),
    };

    loginUseCase = new LoginUseCaseService(
      mockUserRepository,
      mockPasswordHasher,
      mockTokenGenerator,
    );
  });

  it('debe devolver tokens JWT si las credenciales son correctas', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(validUser);
    mockPasswordHasher.compare.mockResolvedValue(true);

    const result = await loginUseCase.execute({
      email: 'test@kambista.com',
      passwordStr: 'password-plano',
    });

    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
      'password-plano',
      'hashed-password',
    );
    expect(mockTokenGenerator.generateAccessToken).toHaveBeenCalledWith(
      'uuid-123',
      'user',
    );
    expect(result).toEqual({
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123',
    });
  });

  it('debe lanzar InvalidCredentialsException si el usuario no existe', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'noexiste@kambista.com',
        passwordStr: '123456',
      }),
    ).rejects.toThrow(InvalidCredentialsException);
  });

  it('debe lanzar InvalidCredentialsException si la contraseña no coincide', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(validUser);
    mockPasswordHasher.compare.mockResolvedValue(false); // Falso = contraseña errónea

    await expect(
      loginUseCase.execute({
        email: 'test@kambista.com',
        passwordStr: 'wrong-password',
      }),
    ).rejects.toThrow(InvalidCredentialsException);
  });
});
