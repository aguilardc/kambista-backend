export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`El usuario con el correo ${email} ya está registrado.`);
    this.name = 'UserAlreadyExistsException';
  }
}
