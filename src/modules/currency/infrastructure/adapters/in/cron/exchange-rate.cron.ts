import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  SYNC_EXCHANGE_RATE_USE_CASE,
  ISyncExchangeRateUseCase,
} from '../../../../application/ports/in/sync-exchange-rate.use-case';

@Injectable()
export class ExchangeRateCron {
  private readonly logger = new Logger(ExchangeRateCron.name);

  constructor(
    @Inject(SYNC_EXCHANGE_RATE_USE_CASE)
    private readonly syncUseCase: ISyncExchangeRateUseCase,
  ) {}

  @Cron('*/30 * * * * *')
  async handleCron() {
    this.logger.debug(
      'Iniciando sincronización programada del tipo de cambio...',
    );
    await this.syncUseCase.execute();
  }
}
