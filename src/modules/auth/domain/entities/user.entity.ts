import { Email } from '../value-objects/email.vo.js';
import { Password } from '../value-objects/password.vo.js';
import { Role } from '../value-objects/role.vo.js';

export class User {
  constructor(
    private readonly id: string,
    private email: Email,
    private password: Password,
    private role: Role,
    private readonly createdAt: Date = new Date(),
  ) {}

  get getId(): string {
    return this.id;
  }
  get getEmail(): string {
    return this.email.getValue;
  }
  get getPassword(): string {
    return this.password.getValue;
  }
  get getRole(): string {
    return this.role.getValue;
  }
  get getCreatedAt(): Date {
    return this.createdAt;
  }

  isAdmin(): boolean {
    return this.role.isAdmin();
  }

  updatePassword(newPassword: Password): void {
    this.password = newPassword;
  }
}
