export const CREATE_TRANSACTION_USE_CASE = Symbol(
  'CREATE_TRANSACTION_USE_CASE',
);

export interface CreateTransactionCommand {
  userId: string;
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
}

export interface ICreateTransactionUseCase {
  execute(command: CreateTransactionCommand): Promise<any>;
}
