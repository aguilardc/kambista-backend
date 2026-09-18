import { TransactionAmount } from '@src/modules/transaction/domain/value-objects/transaction-amount.vo';
import {
  InvalidAmountException
} from '@src/modules/transaction/domain/exceptions/invalid-amount.exception';

describe('TransactionAmount Value Object', () => {
  it('debe crear la instancia si el monto es positivo y tiene hasta 2 decimales', () => {
    const amount = new TransactionAmount(1500.5);
    expect(amount.getValue).toBe(1500.5);
  });

  it('debe lanzar InvalidAmountException si el monto es menor o igual a cero', () => {
    expect(() => new TransactionAmount(0)).toThrow(InvalidAmountException);
    expect(() => new TransactionAmount(-50)).toThrow(InvalidAmountException);
  });

  it('debe lanzar InvalidAmountException si el monto tiene más de 2 decimales', () => {
    expect(() => new TransactionAmount(100.555)).toThrow(
      InvalidAmountException,
    );
  });
});
