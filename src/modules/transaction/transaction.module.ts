import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Controlador (Adaptador In)
import { TransactionController } from './infrastructure/adapters/in/transaction.controller';

// Schema de Mongoose
import {
  TransactionModel,
  TransactionSchema,
} from './infrastructure/adapters/out/schemas/transaction.schema';

// Puertos (Símbolos)
import { TRANSACTION_REPOSITORY } from './application/ports/out/transaction.repository';
import { EXCHANGE_RATE_PROVIDER } from './application/ports/out/exchange-rate.provider';
import { CREATE_TRANSACTION_USE_CASE } from './application/ports/in/create-transaction.use-case';
import { GET_TRANSACTION_HISTORY_USE_CASE } from './application/ports/in/get-transaction-history.use-case';

// Casos de Uso (Aplicación)
import { CreateTransactionUseCaseService } from './application/use-cases/create-transaction.use-case.service';
import { GetTransactionHistoryUseCaseService } from './application/use-cases/get-transaction-history.use-case.service';

// Adaptadores Out (Infraestructura)
import { MongoTransactionRepository } from './infrastructure/adapters/out/mongo-transaction.repository.service';
import { ApiExchangeRateProvider } from './infrastructure/adapters/out/api-exchange-rate.provider.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionModel.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    // Vinculación de Puertos de Salida
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: MongoTransactionRepository,
    },
    {
      provide: EXCHANGE_RATE_PROVIDER,
      useClass: ApiExchangeRateProvider,
    },
    // Vinculación de Puertos de Entrada
    {
      provide: CREATE_TRANSACTION_USE_CASE,
      useClass: CreateTransactionUseCaseService,
    },
    {
      provide: GET_TRANSACTION_HISTORY_USE_CASE,
      useClass: GetTransactionHistoryUseCaseService,
    },
  ],
})
export class TransactionModule {}
