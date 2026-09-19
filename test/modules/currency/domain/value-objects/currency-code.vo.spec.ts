import { describe, it, expect } from 'vitest';
import { CurrencyCode } from '@src/modules/currency/domain/value-objects/currency-code.vo';

describe('CurrencyCode Value Object', () => {
  it('debe crear la instancia si la moneda es USD o PEN (ignorando mayúsculas/minúsculas)', () => {
    expect(new CurrencyCode('USD').getValue).toBe('USD');
    expect(new CurrencyCode('usd').getValue).toBe('USD');
    expect(new CurrencyCode('PEN').getValue).toBe('PEN');
    expect(new CurrencyCode('pen').getValue).toBe('PEN');
  });

  it('debe lanzar un error genérico si la moneda no es soportada', () => {
    expect(() => new CurrencyCode('EUR')).toThrow(
      'Código de moneda no soportado para sincronización: EUR',
    );
  });
});
