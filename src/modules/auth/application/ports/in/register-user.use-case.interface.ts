export const REGISTER_USER_USE_CASE = Symbol('REGISTER_USER_USE_CASE');

export interface RegisterUserCommand {
  email: string;
  passwordStr: string;
  roleStr: string;
}

export interface IRegisterUserUseCase {
  execute(command: RegisterUserCommand): Promise<void>;
}
