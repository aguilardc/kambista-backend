export interface RegisterUserCommand {
  email: string;
  passwordStr: string;
  roleStr: string;
}

export interface IRegisterUserUseCase {
  execute(command: RegisterUserCommand): Promise<void>;
}
