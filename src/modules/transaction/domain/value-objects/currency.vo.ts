import { InvalidCurrencyException } from '../exceptions/invalid-currency.exception';

export enum SupportedCurrencies {
  USD = 'USD',
  PEN = 'PEN',
}

export class Currency {
  private readonly value: SupportedCurrencies;

  constructor(value: string) {
    const upperValue = value.toUpperCase();
    if (!(upperValue in SupportedCurrencies)) {
      throw new InvalidCurrencyException(value);
    }
    this.value =
      SupportedCurrencies[upperValue as keyof typeof SupportedCurrencies];
  }

  get getValue(): SupportedCurrencies {
    return this.value;
  }
}
