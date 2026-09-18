import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  REGISTER_USER_USE_CASE,
  IRegisterUserUseCase,
} from '../../../application/ports/in/register-user.use-case.interface';
import {
  LOGIN_USE_CASE,
  ILoginUseCase,
} from '../../../application/ports/in/login.use-case.interface';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(REGISTER_USER_USE_CASE)
    private readonly registerUseCase: IRegisterUserUseCase,
    @Inject(LOGIN_USE_CASE) private readonly loginUseCase: ILoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    await this.registerUseCase.execute({
      email: registerDto.email,
      passwordStr: registerDto.password,
      roleStr: registerDto.role || 'user',
    });

    return { message: 'Usuario registrado exitosamente' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.loginUseCase.execute({
      email: loginDto.email,
      passwordStr: loginDto.password,
    });

    return tokens;
  }
}
