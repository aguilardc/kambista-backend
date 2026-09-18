import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IRegisterUserUseCase,
  RegisterUserCommand,
} from '../ports/in/register-user.use-case.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../ports/out/user.repository.interface';
import {
  IPasswordHasher,
  PASSWORD_HASHER_PORT,
} from '../ports/out/password-hasher.port.interface';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Role } from '../../domain/value-objects/role.vo';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';

@Injectable()
export class RegisterUserUseCaseService implements IRegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const email = new Email(command.email);
    const password = new Password(command.passwordStr);
    const role = new Role(command.roleStr);

    const existingUser = await this.userRepository.findByEmail(email.getValue);
    if (existingUser) {
      throw new UserAlreadyExistsException(email.getValue);
    }

    const hashedPassword = await this.passwordHasher.hash(password.getValue);

    const newUser = new User(
      randomUUID(),
      email,
      new Password(hashedPassword, true),
      role,
    );

    await this.userRepository.save(newUser);
  }
}
