import { InvalidRateException } from '../exceptions/invalid-rate.exception';

export class RateValue {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new InvalidRateException(value);
    }
    this.value = value;
  }

  get getValue(): number {
    return this.value;
  }
}
