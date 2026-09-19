import { RateValue } from '../value-objects/rate-value.vo';
import { CurrencyCode } from '../value-objects/currency-code.vo';

export class ExchangeRate {
  constructor(
    private readonly currencyCode: CurrencyCode,
    private readonly buyRate: RateValue,
    private readonly sellRate: RateValue,
    private readonly lastSyncDate: Date,
  ) {}

  get getCurrencyCode(): string {
    return this.currencyCode.getValue;
  }

  get getBuyRate(): number {
    return this.buyRate.getValue;
  }

  get getSellRate(): number {
    return this.sellRate.getValue;
  }

  get getLastSyncDate(): Date {
    return this.lastSyncDate;
  }

  public isProfitable(): boolean {
    return this.sellRate.getValue > this.buyRate.getValue;
  }
}
