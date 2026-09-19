export const SYNC_EXCHANGE_RATE_USE_CASE = Symbol(
  'SYNC_EXCHANGE_RATE_USE_CASE',
);

export interface ISyncExchangeRateUseCase {
  execute(): Promise<void>;
}
