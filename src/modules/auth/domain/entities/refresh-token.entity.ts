export class RefreshToken {
  constructor(
    private readonly id: string,
    private readonly token: string,
    private readonly userId: string,
    private readonly expiresAt: Date,
    private isRevoked: boolean = false,
  ) {}

  get getId(): string {
    return this.id;
  }
  get getToken(): string {
    return this.token;
  }
  get getUserId(): string {
    return this.userId;
  }
  get getExpiresAt(): Date {
    return this.expiresAt;
  }
  get getIsRevoked(): boolean {
    return this.isRevoked;
  }

  isValid(): boolean {
    const isExpired = new Date() > this.expiresAt;
    return !this.isRevoked && !isExpired;
  }

  revoke(): void {
    this.isRevoked = true;
  }
}
