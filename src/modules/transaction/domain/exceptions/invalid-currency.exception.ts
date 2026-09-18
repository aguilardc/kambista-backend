export class InvalidCurrencyException extends Error {
  constructor(currency: string) {
    super(`La moneda '${currency}' no es soportada por la plataforma.`);
    this.name = 'InvalidCurrencyException';
  }
}
