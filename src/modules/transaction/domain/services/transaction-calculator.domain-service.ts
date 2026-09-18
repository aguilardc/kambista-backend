import { TransactionAmount } from '../value-objects/transaction-amount.vo';
import { SupportedCurrencies } from '../value-objects/currency.vo';
import { InvalidCurrencyException } from '../exceptions/invalid-currency.exception';

export class TransactionCalculatorDomainService {
  public calculateFinalAmount(
    amount: TransactionAmount,
    exchangeRate: number,
    sourceCurrency: SupportedCurrencies,
  ): TransactionAmount {
    let rawValue: number;

    if (sourceCurrency === SupportedCurrencies.USD) {
      // De USD a PEN: La casa de cambio compra  dólares (multiplica)
      rawValue = amount.getValue * exchangeRate;
    } else if (sourceCurrency === SupportedCurrencies.PEN) {
      // De PEN a USD: La casa de cambio vende dólares (divide)
      rawValue = amount.getValue / exchangeRate;
    } else {
      throw new InvalidCurrencyException(sourceCurrency);
    }

    // Redondear a 2 decimales de forma estricta
    const roundedValue = Math.round(rawValue * 100) / 100;

    return new TransactionAmount(roundedValue);
  }
}
