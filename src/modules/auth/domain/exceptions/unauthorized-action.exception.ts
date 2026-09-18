export class UnauthorizedActionException extends Error {
  constructor() {
    super(
      'No tienes los permisos necesarios para realizar esta acción sobre este recurso.',
    );
    this.name = 'UnauthorizedActionException';
  }
}
