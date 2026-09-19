export class CurrencyCode {
  private readonly value: string;

  constructor(value: string) {
    const upperValue = value.toUpperCase();
    if (upperValue !== 'USD' && upperValue !== 'PEN') {
      throw new Error(
        `Código de moneda no soportado para sincronización: ${value}`,
      );
    }
    this.value = upperValue;
  }

  get getValue(): string {
    return this.value;
  }
}
