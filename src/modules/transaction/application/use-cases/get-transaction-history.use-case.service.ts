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

  async execute(
    currentUser: any,
    startDate: string,
    endDate: string,
    requestedUserId?: string,
  ): Promise<any[]> {
    let targetUserId: string;
    targetUserId = currentUser.sub;
    if (currentUser.role === 'admin' && requestedUserId) {
      targetUserId = requestedUserId;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setUTCHours(23, 59, 59, 999);

    return await this.transactionRepository.findByUserAndDateRange(
      targetUserId,
      start,
      end,
    );
  }
}
