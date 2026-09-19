import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTransactionHistoryUseCaseService } from '@src/modules/transaction/application/use-cases/get-transaction-history.use-case.service';
import { Transaction } from '@src/modules/transaction/domain/entities/transaction.entity';
import { Currency } from '@src/modules/transaction/domain/value-objects/currency.vo';
import { TransactionAmount } from '@src/modules/transaction/domain/value-objects/transaction-amount.vo';

describe('GetTransactionHistoryUseCaseService', () => {
  let useCase: GetTransactionHistoryUseCaseService;
  let mockTransactionRepo: any;

  beforeEach(() => {
    mockTransactionRepo = {
      findByUserId: vi.fn(),
    };
    useCase = new GetTransactionHistoryUseCaseService(mockTransactionRepo);
  });

  it('debe retornar una lista mapeada de transacciones del usuario', async () => {
    // Simulamos una entidad devuelta por el repositorio
    const mockTransaction = new Transaction(
      'tx-1',
      'user-123',
      new Currency('USD'),
      new Currency('PEN'),
      new TransactionAmount(100),
      3.75,
      new TransactionAmount(375),
      new Date('2026-01-01T10:00:00Z'),
    );

    mockTransactionRepo.findByUserId.mockResolvedValue([mockTransaction]);

    const result = await useCase.execute('user-123');

    expect(mockTransactionRepo.findByUserId).toHaveBeenCalledWith('user-123');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'tx-1',
      sourceCurrency: 'USD',
      targetCurrency: 'PEN',
      originalAmount: 100,
      exchangeRateApplied: 3.75,
      finalAmount: 375,
      createdAt: mockTransaction.getCreatedAt,
    });
  });

  it('debe retornar un arreglo vacío si el usuario no tiene transacciones', async () => {
    mockTransactionRepo.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute('user-999');

    expect(result).toEqual([]);
  });
});
