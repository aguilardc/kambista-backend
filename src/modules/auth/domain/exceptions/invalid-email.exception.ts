export class InvalidEmailException extends Error {
  constructor(email: string) {
    super(
      `El correo electrónico provisto (${email}) no tiene un formato válido.`,
    );
    this.name = 'InvalidEmailException';
  }
}
