import { TransactionCalculatorDomainService } from '@src/modules/transaction/domain/services/transaction-calculator.domain-service';
import { TransactionAmount } from '@src/modules/transaction/domain/value-objects/transaction-amount.vo';
import { SupportedCurrencies } from '@src/modules/transaction/domain/value-objects/currency.vo';

describe('TransactionCalculatorDomainService', () => {
  const calculator = new TransactionCalculatorDomainService();

  it('debe multiplicar el monto por la tasa de cambio cuando la moneda de origen es USD', () => {
    const amount = new TransactionAmount(100);
    const exchangeRate = 3.8;

    const result = calculator.calculateFinalAmount(
      amount,
      exchangeRate,
      SupportedCurrencies.USD,
    );

    expect(result.getValue).toBe(380.0);
  });

  it('debe dividir el monto por la tasa de cambio cuando la moneda de origen es PEN', () => {
    const amount = new TransactionAmount(380);
    const exchangeRate = 3.8;

    const result = calculator.calculateFinalAmount(
      amount,
      exchangeRate,
      SupportedCurrencies.PEN,
    );

    expect(result.getValue).toBe(100.0);
  });

  it('debe redondear el resultado a un máximo de 2 decimales', () => {
    const amount = new TransactionAmount(100);
    const exchangeRate = 3.75;

    const result = calculator.calculateFinalAmount(
      amount,
      exchangeRate,
      SupportedCurrencies.PEN,
    );

    expect(result.getValue).toBe(26.67);
  });
});
