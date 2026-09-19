import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  Inject,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import {
  CREATE_TRANSACTION_USE_CASE,
  ICreateTransactionUseCase,
} from '../../../application/ports/in/create-transaction.use-case';
import {
  GET_TRANSACTION_HISTORY_USE_CASE,
  IGetTransactionHistoryUseCase,
} from '../../../application/ports/in/get-transaction-history.use-case';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { JwtAuthGuard } from '../../../../auth/infrastructure/guards/jwt-auth.guard';
import { GetHistoryDto } from '@src/modules/transaction/infrastructure/adapters/in/dtos/get-history.dto';
import { TransactionResponseMapper } from '@src/modules/transaction/infrastructure/adapters/in/mappers/transaction-response.mapper';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    @Inject(CREATE_TRANSACTION_USE_CASE)
    private readonly createTransactionUseCase: ICreateTransactionUseCase,
    @Inject(GET_TRANSACTION_HISTORY_USE_CASE)
    private readonly getHistoryUseCase: IGetTransactionHistoryUseCase,
  ) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateTransactionDto) {
    const userId = req.user?.sub || 'usuario-temporal-id';

    const transaction = await this.createTransactionUseCase.execute({
      userId,
      monedaOrigen: dto.monedaOrigen,
      monedaDestino: dto.monedaDestino,
      monto: dto.monto,
    });

    return {
      id: transaction.getId,
      monedaOrigen: transaction.getSourceCurrency,
      monedaDestino: transaction.getTargetCurrency,
      monto: transaction.getOriginalAmount,
      montoCambiado: transaction.getFinalAmount,
      tipoCambio: transaction.getExchangeRateApplied,
      fecha: transaction.getCreatedAt,
    };
  }

  @Get('history')
  async getHistory(@Req() req: any, @Query() query: GetHistoryDto) {
    const transactions = await this.getHistoryUseCase.execute(
      req.user,
      query.startDate,
      query.endDate,
      query.userId,
    );

    console.log(typeof transactions);

    return transactions.map((tx: any) => TransactionResponseMapper.toDto(tx));
  }
}
