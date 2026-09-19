import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncExchangeRateUseCaseService } from '@src/modules/currency/application/use-cases/sync-exchange-rate.use-case.service';
import { ExchangeRate } from '@src/modules/currency/domain/entities/exchange-rate.entity';

describe('SyncExchangeRateUseCaseService', () => {
  let useCase: SyncExchangeRateUseCaseService;
  let mockSunatProvider: any;
  let mockRepository: any;

  beforeEach(() => {
    mockSunatProvider = {
      fetchLatestRates: vi.fn(),
    };
    mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new SyncExchangeRateUseCaseService(
      mockSunatProvider,
      mockRepository,
    );
  });

  it('debe obtener las tasas de SUNAT, mapearlas a la entidad y guardarlas en el historial', async () => {
    const mockRawData = {
      origen: 'SUNAT',
      compra: 3.7,
      venta: 3.8,
      moneda: 'USD',
      fecha: '2026-09-18',
    };
    mockSunatProvider.fetchLatestRates.mockResolvedValue(mockRawData);

    await useCase.execute();

    expect(mockSunatProvider.fetchLatestRates).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedEntity = mockRepository.save.mock.calls[0][0];
    expect(savedEntity).toBeInstanceOf(ExchangeRate);
    expect(savedEntity.getCurrencyCode).toBe('USD');
    expect(savedEntity.getBuyRate).toBe(3.7);
    expect(savedEntity.getSellRate).toBe(3.8);
    expect(savedEntity.getLastSyncDate).toBeInstanceOf(Date);
  });

  it('debe abortar la sincronización y no guardar si la tasa no es rentable (venta <= compra)', async () => {
    const unprofitableData = {
      origen: 'SUNAT',
      compra: 3.8,
      venta: 3.7,
      moneda: 'USD',
      fecha: '2026-09-18',
    };
    mockSunatProvider.fetchLatestRates.mockResolvedValue(unprofitableData);

    await useCase.execute();

    expect(mockSunatProvider.fetchLatestRates).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('debe manejar los errores y no propagarlos si el proveedor externo falla', async () => {
    // Simulamos que el API de SUNAT está caído
    mockSunatProvider.fetchLatestRates.mockRejectedValue(
      new Error('API Timeout'),
    );

    await expect(useCase.execute()).resolves.not.toThrow();

    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
