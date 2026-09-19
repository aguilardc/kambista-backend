export class InvalidRateException extends Error {
  constructor(value: number) {
    super(
      `El valor de la tasa de cambio debe ser mayor a cero. Recibido: ${value}`,
    );
    this.name = 'InvalidRateException';
  }
}
