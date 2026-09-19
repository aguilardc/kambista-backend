import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExchangeRateRepository } from '../../../application/ports/out/exchange-rate.repository';
import { ExchangeRate } from '../../../domain/entities/exchange-rate.entity';
import { CurrencyCode } from '../../../domain/value-objects/currency-code.vo';
import { RateValue } from '../../../domain/value-objects/rate-value.vo';
import {
  ExchangeRateModel,
  ExchangeRateDocument,
} from './schemas/exchange-rate.schema';

@Injectable()
export class MongoExchangeRateRepository implements IExchangeRateRepository {
  constructor(
    @InjectModel(ExchangeRateModel.name)
    private readonly model: Model<ExchangeRateDocument>,
  ) {}

  async save(exchangeRate: ExchangeRate): Promise<void> {
    const newDoc = new this.model({
      currencyCode: exchangeRate.getCurrencyCode,
      buyRate: exchangeRate.getBuyRate,
      sellRate: exchangeRate.getSellRate,
      syncDate: exchangeRate.getLastSyncDate,
    });
    await newDoc.save();
  }

  async findLatest(currencyCode: CurrencyCode): Promise<ExchangeRate | null> {
    const doc = await this.model
      .findOne({ currencyCode: currencyCode.getValue })
      .sort({ syncDate: -1 })
      .exec();

    if (!doc) return null;

    return new ExchangeRate(
      new CurrencyCode(doc.currencyCode),
      new RateValue(doc.buyRate),
      new RateValue(doc.sellRate),
      doc.syncDate,
    );
  }
}
