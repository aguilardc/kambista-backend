import { Injectable, Inject } from '@nestjs/common';
import { IGetTransactionHistoryUseCase } from '../ports/in/get-transaction-history.use-case';
import {
  TRANSACTION_REPOSITORY,
  ITransactionRepository,
} from '../ports/out/transaction.repository';

@Injectable()
export class GetTransactionHistoryUseCaseService implements IGetTransactionHistoryUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string): Promise<any[]> {
    const transactions = await this.transactionRepository.findByUserId(userId);

    return transactions.map((tx) => ({
      id: tx.getId,
      sourceCurrency: tx.getSourceCurrency,
      targetCurrency: tx.getTargetCurrency,
      originalAmount: tx.getOriginalAmount,
      exchangeRateApplied: tx.getExchangeRateApplied,
      finalAmount: tx.getFinalAmount,
      createdAt: tx.getCreatedAt,
    }));
  }
}
