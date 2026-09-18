import { Injectable, Inject } from '@nestjs/common';
import {
  ILoginUseCase,
  LoginCommand,
  AuthTokens,
} from '../ports/in/login.use-case.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../ports/out/user.repository.interface';
import {
  IPasswordHasher,
  PASSWORD_HASHER_PORT,
} from '../ports/out/password-hasher.port.interface';
import {
  ITokenGenerator,
  TOKEN_GENERATOR_PORT,
} from '../ports/out/token-generator.port.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

@Injectable()
export class LoginUseCaseService implements ILoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_GENERATOR_PORT)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(command: LoginCommand): Promise<AuthTokens> {
    const email = new Email(command.email);

    const user = await this.userRepository.findByEmail(email.getValue);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      command.passwordStr,
      user.getPassword,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = this.tokenGenerator.generateAccessToken(
      user.getId,
      user.getRole,
    );
    const refreshToken = this.tokenGenerator.generateRefreshToken(user.getId);

    return {
      accessToken,
      refreshToken,
    };
  }
}
