export const EXCHANGE_RATE_PROVIDER = Symbol('EXCHANGE_RATE_PROVIDER');

export interface ExchangeRates {
  buy: number; // Precio al que la casa de cambio compra dólares (USD -> PEN)
  sell: number; // Precio al que la casa de cambio vende dólares (PEN -> USD)
}

export interface IExchangeRateProvider {
  getRates(): Promise<ExchangeRates>;
}
