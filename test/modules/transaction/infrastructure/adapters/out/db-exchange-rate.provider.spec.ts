import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InternalServerErrorException } from '@nestjs/common';
import { DbExchangeRateProvider } from '@src/modules/transaction/infrastructure/adapters/out/db-exchange-rate.provider.service';

describe('DbExchangeRateProvider', () => {
  let provider: DbExchangeRateProvider;
  let mockExchangeRateModel: any;

  beforeEach(() => {
    mockExchangeRateModel = {
      findOne: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn(),
    };

    provider = new DbExchangeRateProvider(mockExchangeRateModel);
  });

  it('debe retornar las tasas de compra y venta del último registro histórico', async () => {
    const mockLatestRate = {
      currencyCode: 'USD',
      buyRate: 3.75,
      sellRate: 3.85,
      syncDate: new Date('2026-09-18T10:00:00Z'),
    };

    mockExchangeRateModel.exec.mockResolvedValue(mockLatestRate);

    const result = await provider.getRates();

    expect(mockExchangeRateModel.findOne).toHaveBeenCalledWith({
      currencyCode: 'USD',
    });
    expect(mockExchangeRateModel.sort).toHaveBeenCalledWith({ syncDate: -1 });

    expect(result).toEqual({ buy: 3.75, sell: 3.85 });
  });

  it('debe lanzar InternalServerErrorException si el historial de tipos de cambio está vacío', async () => {
    mockExchangeRateModel.exec.mockResolvedValue(null);

    await expect(provider.getRates()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.getRates()).rejects.toThrow(
      'El tipo de cambio aún no ha sido sincronizado desde SUNAT. Intente en unos segundos.',
    );
  });
});
