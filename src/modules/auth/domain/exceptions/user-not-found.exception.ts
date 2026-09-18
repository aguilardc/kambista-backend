export class UserNotFoundException extends Error {
  constructor(identifier: string) {
    super(`No se encontró un usuario asociado a: ${identifier}`);
    this.name = 'UserNotFoundException';
  }
}
