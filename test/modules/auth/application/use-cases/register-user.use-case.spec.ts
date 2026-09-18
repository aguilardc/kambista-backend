import { RegisterUserUseCaseService } from '@src/modules/auth/application/use-cases/register-user.use-case.service';
import { UserAlreadyExistsException } from '@src/modules/auth/domain/exceptions/user-already-exists.exception';
import { User } from '@src/modules/auth/domain/entities/user.entity';
import { Email } from '@src/modules/auth/domain/value-objects/email.vo';
import { Password } from '@src/modules/auth/domain/value-objects/password.vo';
import { Role } from '@src/modules/auth/domain/value-objects/role.vo';

describe('RegisterUserUseCaseService', () => {
  let registerUseCase: RegisterUserUseCaseService;
  let mockUserRepository: any;
  let mockPasswordHasher: any;

  beforeEach(() => {
    // Mocks de los puertos de salida
    mockUserRepository = {
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
    mockPasswordHasher = {
      hash: vi.fn().mockResolvedValue('hashed-password'),
    };

    registerUseCase = new RegisterUserUseCaseService(
      mockUserRepository,
      mockPasswordHasher,
    );
  });

  it('debe registrar un usuario exitosamente si el correo no existe', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await registerUseCase.execute({
      email: 'nuevo@kambista.com',
      passwordStr: '123456',
      roleStr: 'user',
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'nuevo@kambista.com',
    );
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('123456');
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

    // Verificamos que se guarde una instancia de User
    const savedArgument = mockUserRepository.save.mock.calls[0][0];
    expect(savedArgument).toBeInstanceOf(User);
    expect(savedArgument.getEmail).toBe('nuevo@kambista.com');
    expect(savedArgument.getPassword).toBe('hashed-password'); // Asegura que se guardó la encriptada
  });

  it('debe lanzar UserAlreadyExistsException si el correo ya está registrado', async () => {
    // Simulamos que el repositorio encuentra un usuario
    const existingUser = new User(
      '1',
      new Email('existe@kambista.com'),
      new Password('hashed', true),
      new Role('user'),
    );
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      registerUseCase.execute({
        email: 'existe@kambista.com',
        passwordStr: '123456',
        roleStr: 'user',
      }),
    ).rejects.toThrow(UserAlreadyExistsException);

    // No debe llegar a encriptar ni a guardar
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
