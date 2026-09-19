import { describe, it, expect } from 'vitest';
import { ExchangeRate } from '@src/modules/currency/domain/entities/exchange-rate.entity';
import { RateValue } from '@src/modules/currency/domain/value-objects/rate-value.vo';
import { CurrencyCode } from '@src/modules/currency/domain/value-objects/currency-code.vo';

describe('ExchangeRate Entity', () => {
  it('debe crear la entidad correctamente y exponer sus valores primitivos', () => {
    const syncDate = new Date('2026-09-18T10:00:00Z');
    const entity = new ExchangeRate(
      new CurrencyCode('USD'),
      new RateValue(3.7),
      new RateValue(3.8),
      syncDate,
    );

    expect(entity.getCurrencyCode).toBe('USD');
    expect(entity.getBuyRate).toBe(3.7);
    expect(entity.getSellRate).toBe(3.8);
    expect(entity.getLastSyncDate).toBe(syncDate);
  });

  it('debe retornar true en isProfitable() si la tasa de venta es mayor a la de compra', () => {
    const entity = new ExchangeRate(
      new CurrencyCode('USD'),
      new RateValue(3.7),
      new RateValue(3.8),
      new Date(),
    );
    expect(entity.isProfitable()).toBe(true);
  });

  it('debe retornar false en isProfitable() si la tasa de venta es igual o menor a la de compra', () => {
    const entityEqual = new ExchangeRate(
      new CurrencyCode('USD'),
      new RateValue(3.8),
      new RateValue(3.8),
      new Date(),
    );
    expect(entityEqual.isProfitable()).toBe(false);

    const entityLoss = new ExchangeRate(
      new CurrencyCode('USD'),
      new RateValue(3.8),
      new RateValue(3.7),
      new Date(),
    );
    expect(entityLoss.isProfitable()).toBe(false);
  });
});
