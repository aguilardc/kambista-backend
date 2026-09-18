import { InvalidPasswordException } from '../exceptions/invalid-password.exception.js';

export class Password {
  private readonly value: string;
  constructor(value: string, isHashed: boolean = false) {
    if (!isHashed && !this.isValid(value)) {
      throw new InvalidPasswordException();
    }
    this.value = value;
  }

  get getValue(): string {
    return this.value;
  }

  private isValid(password: string): boolean {
    return password.length >= 6;
  }
}
