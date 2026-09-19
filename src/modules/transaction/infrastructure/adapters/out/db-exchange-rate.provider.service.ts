import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IExchangeRateProvider,
  ExchangeRates,
} from '../../../application/ports/out/exchange-rate.provider';
// Importamos el Schema que le pertenece al módulo Currency
import {
  ExchangeRateModel,
  ExchangeRateDocument,
} from '../../../../currency/infrastructure/adapters/out/schemas/exchange-rate.schema';

@Injectable()
export class DbExchangeRateProvider implements IExchangeRateProvider {
  constructor(
    @InjectModel(ExchangeRateModel.name)
    private readonly exchangeRateModel: Model<ExchangeRateDocument>,
  ) {}

  async getRates(): Promise<ExchangeRates> {
    // Buscamos el registro más reciente en el historial
    const latestRate = await this.exchangeRateModel
      .findOne({ currencyCode: 'USD' })
      .sort({ syncDate: -1 })
      .exec();

    if (!latestRate) {
      throw new InternalServerErrorException(
        'El tipo de cambio aún no ha sido sincronizado desde SUNAT. Intente en unos segundos.',
      );
    }

    return {
      buy: latestRate.buyRate,
      sell: latestRate.sellRate,
    };
  }
}
