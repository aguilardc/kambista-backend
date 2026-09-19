import { Injectable, Inject, Logger } from '@nestjs/common';
import { SUNAT_PROVIDER, ISunatProvider } from '../ports/out/sunat.provider';
import {
  EXCHANGE_RATE_REPOSITORY,
  IExchangeRateRepository,
} from '../ports/out/exchange-rate.repository';
import {
  SYNC_EXCHANGE_RATE_USE_CASE,
  ISyncExchangeRateUseCase,
} from '../ports/in/sync-exchange-rate.use-case';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import { RateValue } from '../../domain/value-objects/rate-value.vo';
import { CurrencyCode } from '../../domain/value-objects/currency-code.vo';

@Injectable()
export class SyncExchangeRateUseCaseService implements ISyncExchangeRateUseCase {
  private readonly logger = new Logger(SyncExchangeRateUseCaseService.name);

  constructor(
    @Inject(SUNAT_PROVIDER) private readonly sunatProvider: ISunatProvider,
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repository: IExchangeRateRepository,
  ) {}

  async execute(): Promise<void> {
    try {
      const rawData = await this.sunatProvider.fetchLatestRates();

      const syncDate = new Date();

      const exchangeRate = new ExchangeRate(
        new CurrencyCode(rawData.moneda),
        new RateValue(rawData.compra),
        new RateValue(rawData.venta),
        syncDate,
      );

      if (!exchangeRate.isProfitable()) {
        this.logger.warn(
          'La tasa de venta es menor o igual a la de compra. Registro histórico abortado.',
        );
        return;
      }

      await this.repository.save(exchangeRate);

      this.logger.debug(
        `Historial SUNAT actualizado: ${rawData.moneda} - Compra ${rawData.compra} / Venta ${rawData.venta}`,
      );
    } catch (error) {
      this.logger.error(
        'Error al sincronizar y guardar el tipo de cambio con SUNAT',
        error,
      );
    }
  }
}
