import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionController } from '@src/modules/transaction/infrastructure/adapters/in/transaction.controller';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockCreateUseCase: any;
  let mockGetHistoryUseCase: any;

  beforeEach(() => {
    mockCreateUseCase = { execute: vi.fn().mockResolvedValue({ id: 'tx-1' }) };
    mockGetHistoryUseCase = {
      execute: vi.fn().mockResolvedValue([{ id: 'tx-1' }]),
    };

    controller = new TransactionController(
      mockCreateUseCase,
      mockGetHistoryUseCase,
    );
  });

  it('debe delegar la creación de la transacción y mapear el userId del request', async () => {
    // Simulamos el Request inyectado por el futuro AuthGuard
    const req = { user: { sub: 'user-1' } };
    const dto = { sourceCurrency: 'USD', targetCurrency: 'PEN', amount: 100 };

    const result = await controller.create(req, dto);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-1',
      sourceCurrency: 'USD',
      targetCurrency: 'PEN',
      amount: 100,
    });
    expect(result).toEqual({ id: 'tx-1' });
  });

  it('debe retornar el historial de transacciones utilizando el userId del request', async () => {
    const req = { user: { sub: 'user-2' } };

    const result = await controller.getHistory(req);

    expect(mockGetHistoryUseCase.execute).toHaveBeenCalledWith('user-2');
    expect(result).toEqual([{ id: 'tx-1' }]);
  });
});
