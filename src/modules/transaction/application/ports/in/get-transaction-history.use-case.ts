export const GET_TRANSACTION_HISTORY_USE_CASE = Symbol(
  'GET_TRANSACTION_HISTORY_USE_CASE',
);

export interface IGetTransactionHistoryUseCase {
  execute(
    currentUser: any,
    startDate: string,
    endDate: string,
    requestedUserId?: string,
  ): Promise<any[]>;
}
