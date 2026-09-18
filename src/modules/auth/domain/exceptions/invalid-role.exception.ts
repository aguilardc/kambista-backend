export class InvalidRoleException extends Error {
  constructor(role: string) {
    super(
      `El rol '${role}' no es válido. Los roles permitidos son 'admin' y 'user'.`,
    );
    this.name = 'InvalidRoleException';
  }
}
