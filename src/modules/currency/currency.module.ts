import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

// Schemas
import {
  ExchangeRateModel,
  ExchangeRateSchema,
} from './infrastructure/adapters/out/schemas/exchange-rate.schema';

// Ports
import { SUNAT_PROVIDER } from './application/ports/out/sunat.provider';
import { EXCHANGE_RATE_REPOSITORY } from './application/ports/out/exchange-rate.repository';
import { SYNC_EXCHANGE_RATE_USE_CASE } from './application/ports/in/sync-exchange-rate.use-case';

// Use Cases
import { SyncExchangeRateUseCaseService } from './application/use-cases/sync-exchange-rate.use-case.service';

// Adapters
import { ApiSunatProvider } from './infrastructure/adapters/out/api-sunat.provider';
import { MongoExchangeRateRepository } from './infrastructure/adapters/out/mongo-exchange-rate.repository';
import { ExchangeRateCron } from './infrastructure/adapters/in/cron/exchange-rate.cron';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ExchangeRateModel.name, schema: ExchangeRateSchema },
    ]),
  ],
  providers: [
    { provide: SUNAT_PROVIDER, useClass: ApiSunatProvider },
    {
      provide: EXCHANGE_RATE_REPOSITORY,
      useClass: MongoExchangeRateRepository,
    },
    {
      provide: SYNC_EXCHANGE_RATE_USE_CASE,
      useClass: SyncExchangeRateUseCaseService,
    },
    ExchangeRateCron,
  ],
  exports: [EXCHANGE_RATE_REPOSITORY],
})
export class CurrencyModule {}
