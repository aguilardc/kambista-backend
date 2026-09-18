export class InvalidPasswordException extends Error {
  constructor() {
    super('La contraseña debe tener al menos 6 caracteres.');
    this.name = 'InvalidPasswordException';
  }
}
