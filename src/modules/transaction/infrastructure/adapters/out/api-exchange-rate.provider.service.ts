import { Injectable } from '@nestjs/common';
import {
  IExchangeRateProvider,
  ExchangeRates,
} from '../../../application/ports/out/exchange-rate.provider';

@Injectable()
export class ApiExchangeRateProvider implements IExchangeRateProvider {
  async getRates(): Promise<ExchangeRates> {
    return {
      buy: 3.7,
      sell: 3.8,
    };
  }
}
