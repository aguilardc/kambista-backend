import { ExchangeRate } from '../../../domain/entities/exchange-rate.entity';
import { CurrencyCode } from '../../../domain/value-objects/currency-code.vo';

export const EXCHANGE_RATE_REPOSITORY = Symbol('EXCHANGE_RATE_REPOSITORY');

export interface IExchangeRateRepository {
  save(exchangeRate: ExchangeRate): Promise<void>;
  findLatest(currencyCode: CurrencyCode): Promise<ExchangeRate | null>;
}
