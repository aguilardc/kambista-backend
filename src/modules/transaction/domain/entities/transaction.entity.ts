import { TransactionAmount } from '../value-objects/transaction-amount.vo';
import { Currency } from '../value-objects/currency.vo';
import { IdenticalCurrenciesException } from '../exceptions/identical-currencies.exception';

export class Transaction {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly sourceCurrency: Currency,
    private readonly targetCurrency: Currency,
    private readonly originalAmount: TransactionAmount,
    private readonly exchangeRateApplied: number,
    private readonly finalAmount: TransactionAmount,
    private readonly createdAt: Date = new Date(),
  ) {
    if (this.sourceCurrency.getValue === this.targetCurrency.getValue) {
      throw new IdenticalCurrenciesException();
    }
  }

  get getId(): string {
    return this.id;
  }
  get getUserId(): string {
    return this.userId;
  }
  get getSourceCurrency(): string {
    return this.sourceCurrency.getValue;
  }
  get getTargetCurrency(): string {
    return this.targetCurrency.getValue;
  }
  get getOriginalAmount(): number {
    return this.originalAmount.getValue;
  }
  get getExchangeRateApplied(): number {
    return this.exchangeRateApplied;
  }
  get getFinalAmount(): number {
    return this.finalAmount.getValue;
  }
  get getCreatedAt(): Date {
    return this.createdAt;
  }
}
