export const SUNAT_PROVIDER = Symbol('SUNAT_PROVIDER');

export interface SunatExchangeRateResponse {
  origen: string;
  compra: number;
  venta: number;
  moneda: string;
  fecha: string;
}

export interface ISunatProvider {
  fetchLatestRates(): Promise<SunatExchangeRateResponse>;
}
