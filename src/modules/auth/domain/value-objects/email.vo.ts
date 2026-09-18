import { InvalidEmailException } from '../exceptions/invalid-email.exception.js';

export class Email {
  private readonly value: string;
  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new InvalidEmailException(value);
    }
    this.value = value;
  }

  get getValue(): string {
    return this.value;
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
