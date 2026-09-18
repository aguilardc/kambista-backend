import {
  Currency,
  SupportedCurrencies,
} from '@src/modules/transaction/domain/value-objects/currency.vo';
import { InvalidCurrencyException } from '@src/modules/transaction/domain/exceptions/invalid-currency.exception';

describe('Currency Value Object', () => {
  it('debe crear la instancia y mapear correctamente al enum si la moneda es válida', () => {
    expect(new Currency('PEN').getValue).toBe(SupportedCurrencies.PEN);
    expect(new Currency('usd').getValue).toBe(SupportedCurrencies.USD);
  });

  it('debe lanzar InvalidCurrencyException si la moneda no es soportada', () => {
    expect(() => new Currency('EUR')).toThrow(InvalidCurrencyException);
    expect(() => new Currency('MXN')).toThrow(InvalidCurrencyException);
  });
});
