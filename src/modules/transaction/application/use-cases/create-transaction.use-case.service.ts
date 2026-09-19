import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  ICreateTransactionUseCase,
  CreateTransactionCommand,
} from '../ports/in/create-transaction.use-case';
import {
  TRANSACTION_REPOSITORY,
  ITransactionRepository,
} from '../ports/out/transaction.repository';
import {
  EXCHANGE_RATE_PROVIDER,
  IExchangeRateProvider,
} from '../ports/out/exchange-rate.provider';
import { TransactionCalculatorDomainService } from '../../domain/services/transaction-calculator.domain-service';
import { Transaction } from '../../domain/entities/transaction.entity';
import {
  Currency,
  SupportedCurrencies,
} from '../../domain/value-objects/currency.vo';
import { TransactionAmount } from '../../domain/value-objects/transaction-amount.vo';
import { InvalidCurrencyException } from '@src/modules/transaction/domain/exceptions/invalid-currency.exception';

@Injectable()
export class CreateTransactionUseCaseService implements ICreateTransactionUseCase {
  private readonly calculator = new TransactionCalculatorDomainService();

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(EXCHANGE_RATE_PROVIDER)
    private readonly exchangeRateProvider: IExchangeRateProvider,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<any> {
    const sourceCurrency = new Currency(command.monedaOrigen);
    const targetCurrency = new Currency(command.monedaDestino);
    const originalAmount = new TransactionAmount(command.monto);

    const rates = await this.exchangeRateProvider.getRates();

    // Si el usuario da USD, la plataforma compra dólares. Si da PEN, la plataforma vende dólares.
    let appliedRate;
    if (sourceCurrency.getValue === SupportedCurrencies.USD) {
      appliedRate = rates.buy;
    } else if (sourceCurrency.getValue === SupportedCurrencies.PEN) {
      appliedRate = rates.sell;
    } else {
      throw new InvalidCurrencyException(sourceCurrency.getValue);
    }

    const finalAmount = this.calculator.calculateFinalAmount(
      originalAmount,
      appliedRate,
      sourceCurrency.getValue,
    );

    const transaction = new Transaction(
      uuidv4(),
      command.userId,
      sourceCurrency,
      targetCurrency,
      originalAmount,
      appliedRate,
      finalAmount,
    );

    await this.transactionRepository.save(transaction);
    return transaction;
  }
}
