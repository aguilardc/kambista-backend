import { describe, it, expect } from 'vitest';
import { RateValue } from '@src/modules/currency/domain/value-objects/rate-value.vo';
import { InvalidRateException } from '@src/modules/currency/domain/exceptions/invalid-rate.exception';

describe('RateValue Value Object', () => {
  it('debe crear la instancia si el valor es mayor a cero', () => {
    const rate = new RateValue(3.8);
    expect(rate.getValue).toBe(3.8);
  });

  it('debe lanzar InvalidRateException si el valor es cero', () => {
    expect(() => new RateValue(0)).toThrow(InvalidRateException);
  });

  it('debe lanzar InvalidRateException si el valor es negativo', () => {
    expect(() => new RateValue(-1.5)).toThrow(InvalidRateException);
  });
});
