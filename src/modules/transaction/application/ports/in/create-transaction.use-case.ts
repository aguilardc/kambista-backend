export const CREATE_TRANSACTION_USE_CASE = Symbol(
  'CREATE_TRANSACTION_USE_CASE',
);

export interface CreateTransactionCommand {
  userId: string;
  monedaOrigen: string;
  monedaDestino: string;
  monto: number;
}

export interface ICreateTransactionUseCase {
  execute(command: CreateTransactionCommand): Promise<any>;
}
