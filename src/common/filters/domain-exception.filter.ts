import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const domainExceptionsMapping: Record<string, HttpStatus> = {
      InvalidCredentialsException: HttpStatus.UNAUTHORIZED,
      UserAlreadyExistsException: HttpStatus.CONFLICT,
      UserNotFoundException: HttpStatus.NOT_FOUND,
      UnauthorizedActionException: HttpStatus.FORBIDDEN,
      InvalidEmailException: HttpStatus.BAD_REQUEST,
      InvalidPasswordException: HttpStatus.BAD_REQUEST,
      InvalidRoleException: HttpStatus.BAD_REQUEST,
      IdenticalCurrenciesException: HttpStatus.BAD_REQUEST,
      InvalidAmountException: HttpStatus.BAD_REQUEST,
      InvalidCurrencyException: HttpStatus.BAD_REQUEST,
    };

    const statusCode = domainExceptionsMapping[exception.name];

    if (statusCode) {
      response.status(statusCode).json({
        statusCode,
        error: exception.name,
        message: exception.message,
      });
    } else {
      console.error('Error no controlado', exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }
}
