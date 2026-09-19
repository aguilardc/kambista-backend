import { describe, it, expect } from 'vitest';
import { ApiExchangeRateProvider } from '@src/modules/transaction/infrastructure/adapters/out/api-exchange-rate.provider.service';

describe('ApiExchangeRateProvider', () => {
  it('debe retornar las tasas de compra y venta simuladas', async () => {
    const provider = new ApiExchangeRateProvider();
    const rates = await provider.getRates();

    expect(rates.buy).toBe(3.7);
    expect(rates.sell).toBe(3.8);
  });
});
