export interface LoginCommand {
  email: string;
  passwordStr: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginUseCase {
  execute(command: LoginCommand): Promise<AuthTokens>;
}
