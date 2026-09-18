export const PASSWORD_HASHER_PORT = Symbol('PASSWORD_HASHER_PORT');

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
