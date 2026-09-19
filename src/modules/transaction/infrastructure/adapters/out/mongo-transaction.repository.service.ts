import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransactionRepository } from '../../../application/ports/out/transaction.repository';
import {
  Transaction,
  Transaction as DomainTransaction,
} from '../../../domain/entities/transaction.entity';
import { Currency } from '../../../domain/value-objects/currency.vo';
import { TransactionAmount } from '../../../domain/value-objects/transaction-amount.vo';
import {
  TransactionModel,
  TransactionDocument,
} from './schemas/transaction.schema';

@Injectable()
export class MongoTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionModel.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async save(transaction: DomainTransaction): Promise<void> {
    const newDoc = new this.transactionModel({
      _id: transaction.getId,
      userId: transaction.getUserId,
      sourceCurrency: transaction.getSourceCurrency,
      targetCurrency: transaction.getTargetCurrency,
      originalAmount: transaction.getOriginalAmount,
      exchangeRateApplied: transaction.getExchangeRateApplied,
      finalAmount: transaction.getFinalAmount,
      createdAt: transaction.getCreatedAt,
    });
    await newDoc.save();
  }

  async findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    const docs = await this.transactionModel
      .find({
        userId: userId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    return docs.map(
      (doc) =>
        new Transaction(
          doc.id || doc._id.toString(),
          doc.userId,
          new Currency(doc.sourceCurrency),
          new Currency(doc.targetCurrency),
          new TransactionAmount(doc.originalAmount),
          doc.exchangeRateApplied,
          new TransactionAmount(doc.finalAmount),
          doc.createdAt,
        ),
    );
  }
}
