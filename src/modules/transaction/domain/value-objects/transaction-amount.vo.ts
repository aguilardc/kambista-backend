import { InvalidAmountException } from '../exceptions/invalid-amount.exception';

export class TransactionAmount {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new InvalidAmountException('Debe ser mayor a cero.');
    }

    const regex = /^\d{1,7}(\.\d{1,2})?$/;
    if (!regex.test(value.toString())) {
      throw new InvalidAmountException(
        'Excede el límite de 7 enteros o tiene más de 2 decimales.',
      );
    }

    this.value = value;
  }

  get getValue(): number {
    return this.value;
  }
}
