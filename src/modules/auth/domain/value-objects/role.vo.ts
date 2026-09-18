import { InvalidRoleException } from '../exceptions/invalid-role.exception.js';

export const ValidRoles = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

type RoleType = (typeof ValidRoles)[keyof typeof ValidRoles];

export class Role {
  private readonly value: RoleType;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidRoleException(value);
    }
    this.value = value as RoleType;
  }

  get getValue(): RoleType {
    return this.value;
  }

  isAdmin(): boolean {
    return this.value === ValidRoles.ADMIN;
  }

  private isValid(role: string): boolean {
    return Object.values(ValidRoles).includes(role as RoleType);
  }
}
