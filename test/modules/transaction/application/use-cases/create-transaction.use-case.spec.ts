import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTransactionUseCaseService } from '@src/modules/transaction/application/use-cases/create-transaction.use-case.service';
import { InvalidCurrencyException } from '@src/modules/transaction/domain/exceptions/invalid-currency.exception';
import { IdenticalCurrenciesException } from '@src/modules/transaction/domain/exceptions/identical-currencies.exception';

describe('CreateTransactionUseCaseService', () => {
  let useCase: CreateTransactionUseCaseService;
  let mockTransactionRepo: any;
  let mockExchangeRateProvider: any;

  beforeEach(() => {
    mockTransactionRepo = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    mockExchangeRateProvider = {
      // Simulamos que la casa de cambio compra dólares a 3.70 y los vende a 3.80
      getRates: vi.fn().mockResolvedValue({ buy: 3.7, sell: 3.8 }),
    };

    useCase = new CreateTransactionUseCaseService(
      mockTransactionRepo,
      mockExchangeRateProvider,
    );
  });

  it('debe aplicar la tasa de COMPRA cuando el usuario envía USD', async () => {
    const result = await useCase.execute({
      userId: 'user-123',
      sourceCurrency: 'USD',
      targetCurrency: 'PEN',
      amount: 100, // 100 USD * 3.70 (compra) = 370 PEN
    });

    expect(mockExchangeRateProvider.getRates).toHaveBeenCalled();
    expect(mockTransactionRepo.save).toHaveBeenCalledTimes(1);

    expect(result.sourceCurrency).toBe('USD');
    expect(result.exchangeRateApplied).toBe(3.7);
    expect(result.finalAmount).toBe(370);
  });

  it('debe aplicar la tasa de VENTA cuando el usuario envía PEN', async () => {
    const result = await useCase.execute({
      userId: 'user-123',
      sourceCurrency: 'PEN',
      targetCurrency: 'USD',
      amount: 380, // 380 PEN / 3.80 (venta) = 100 USD
    });

    expect(mockExchangeRateProvider.getRates).toHaveBeenCalled();
    expect(mockTransactionRepo.save).toHaveBeenCalledTimes(1);

    expect(result.sourceCurrency).toBe('PEN');
    expect(result.exchangeRateApplied).toBe(3.8);
    expect(result.finalAmount).toBe(100);
  });

  it('debe lanzar IdenticalCurrenciesException si las monedas son iguales', async () => {
    await expect(
      useCase.execute({
        userId: 'user-123',
        sourceCurrency: 'USD',
        targetCurrency: 'USD',
        amount: 100,
      }),
    ).rejects.toThrow(IdenticalCurrenciesException);

    expect(mockTransactionRepo.save).not.toHaveBeenCalled();
  });

  it('debe lanzar InvalidCurrencyException si se envía una moneda no soportada', async () => {
    await expect(
      useCase.execute({
        userId: 'user-123',
        sourceCurrency: 'EUR',
        targetCurrency: 'PEN',
        amount: 100,
      }),
    ).rejects.toThrow(InvalidCurrencyException);

    expect(mockTransactionRepo.save).not.toHaveBeenCalled();
  });
});
