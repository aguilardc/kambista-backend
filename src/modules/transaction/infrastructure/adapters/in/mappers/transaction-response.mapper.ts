import { Transaction } from '../../../../domain/entities/transaction.entity';

export class TransactionResponseMapper {
  static toDto(transaction: Transaction) {
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
}
