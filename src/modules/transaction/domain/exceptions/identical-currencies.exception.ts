export class IdenticalCurrenciesException extends Error {
  constructor() {
    super('Las monedas de origen y destino no pueden ser iguales.');
    this.name = 'IdenticalCurrenciesException';
  }
}
