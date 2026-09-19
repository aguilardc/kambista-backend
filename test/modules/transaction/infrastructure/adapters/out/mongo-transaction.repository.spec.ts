import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoTransactionRepository } from '@src/modules/transaction/infrastructure/adapters/out/mongo-transaction.repository.service';
import { Transaction as DomainTransaction } from '@src/modules/transaction/domain/entities/transaction.entity';
import { Currency } from '@src/modules/transaction/domain/value-objects/currency.vo';
import { TransactionAmount } from '@src/modules/transaction/domain/value-objects/transaction-amount.vo';

describe('MongoTransactionRepository', () => {
  let repository: MongoTransactionRepository;
  let mockTransactionModel: any;

  beforeEach(() => {
    // Simulamos el constructor del modelo Mongoose
    mockTransactionModel = function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(this);
    };

    mockTransactionModel.find = vi.fn();
    repository = new MongoTransactionRepository(mockTransactionModel);
  });

  it('debe guardar una transacción exitosamente extrayendo los datos del dominio', async () => {
    const tx = new DomainTransaction(
      'tx-1',
      'user-1',
      new Currency('USD'),
      new Currency('PEN'),
      new TransactionAmount(100),
      3.7,
      new TransactionAmount(370),
    );

    await expect(repository.save(tx)).resolves.not.toThrow();
  });

  it('debe retornar una lista de transacciones ordenadas mapeadas al dominio', async () => {
    const mockDoc = {
      _id: 'tx-1',
      userId: 'user-1',
      sourceCurrency: 'USD',
      targetCurrency: 'PEN',
      originalAmount: 100,
      exchangeRateApplied: 3.7,
      finalAmount: 370,
      createdAt: new Date(),
    };

    // Simulamos la cadena find().sort().exec() de Mongoose
    mockTransactionModel.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockDoc]),
      }),
    });

    const result = await repository.findByUserId('user-1');

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(DomainTransaction);
    expect(result[0].getId).toBe('tx-1');
  });
});
