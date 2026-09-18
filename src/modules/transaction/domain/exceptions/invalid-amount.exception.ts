export class InvalidAmountException extends Error {
  constructor(message: string) {
    super(`Monto inválido: ${message}`);
    this.name = 'InvalidAmountException';
  }
}
