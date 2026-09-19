import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = TransactionModel & Document;

@Schema({ collection: 'transactions' })
export class TransactionModel {
  @Prop({ required: true, type: String })
  _id: string;

  @Prop({ required: true, type: String, index: true })
  userId: string;

  @Prop({ required: true, type: String })
  sourceCurrency: string;

  @Prop({ required: true, type: String })
  targetCurrency: string;

  @Prop({ required: true, type: Number })
  originalAmount: number;

  @Prop({ required: true, type: Number })
  exchangeRateApplied: number;

  @Prop({ required: true, type: Number })
  finalAmount: number;

  @Prop({ required: true, type: Date })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);
