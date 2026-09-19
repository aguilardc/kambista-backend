export const GET_TRANSACTION_HISTORY_USE_CASE = Symbol(
  'GET_TRANSACTION_HISTORY_USE_CASE',
);

export interface IGetTransactionHistoryUseCase {
  execute(userId: string): Promise<any[]>;
}
