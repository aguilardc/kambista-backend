export const TOKEN_GENERATOR_PORT = Symbol('TOKEN_GENERATOR_PORT');

export interface ITokenGenerator {
  generateAccessToken(userId: string, role: string): string;
  generateRefreshToken(userId: string): string;
}
