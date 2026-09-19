import { Controller, Post, Get, Body, Request, Inject } from '@nestjs/common';
import {
  CREATE_TRANSACTION_USE_CASE,
  ICreateTransactionUseCase,
} from '../../../application/ports/in/create-transaction.use-case';
import {
  GET_TRANSACTION_HISTORY_USE_CASE,
  IGetTransactionHistoryUseCase,
} from '../../../application/ports/in/get-transaction-history.use-case';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(CREATE_TRANSACTION_USE_CASE)
    private readonly createUseCase: ICreateTransactionUseCase,
    @Inject(GET_TRANSACTION_HISTORY_USE_CASE)
    private readonly getHistoryUseCase: IGetTransactionHistoryUseCase,
  ) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateTransactionDto) {
    const userId = req.user?.sub || 'usuario-temporal-id';

    return this.createUseCase.execute({
      userId,
      sourceCurrency: dto.sourceCurrency,
      targetCurrency: dto.targetCurrency,
      amount: dto.amount,
    });
  }

  @Get('history')
  async getHistory(@Request() req: any) {
    const userId = req.user?.sub || 'usuario-temporal-id';
    return this.getHistoryUseCase.execute(userId);
  }
}
