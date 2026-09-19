import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExchangeRateDocument = ExchangeRateModel & Document;

@Schema({ collection: 'exchange_rates', timestamps: true })
export class ExchangeRateModel {
  @Prop({ required: true, index: true })
  currencyCode: string;

  @Prop({ required: true, type: Number })
  buyRate: number;

  @Prop({ required: true, type: Number })
  sellRate: number;

  @Prop({ required: true, type: Date, index: -1 })
  syncDate: Date;
}

export const ExchangeRateSchema =
  SchemaFactory.createForClass(ExchangeRateModel);
