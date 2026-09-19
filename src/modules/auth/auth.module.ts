import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controlador (Adaptador In)
import { AuthController } from './infrastructure/adapters/in/auth.controller';

// Schema (Mongoose)
import {
  User,
  UserSchema,
} from './infrastructure/adapters/out/schemas/user.schema';

// Puertos (Símbolos)
import { USER_REPOSITORY } from './application/ports/out/user.repository.interface';
import { PASSWORD_HASHER_PORT } from './application/ports/out/password-hasher.port.interface';
import { TOKEN_GENERATOR_PORT } from './application/ports/out/token-generator.port.interface';
import { REGISTER_USER_USE_CASE } from './application/ports/in/register-user.use-case.interface';
import { LOGIN_USE_CASE } from './application/ports/in/login.use-case.interface';

// Casos de Uso (Servicios de Aplicación)
import { RegisterUserUseCaseService } from './application/use-cases/register-user.use-case.service';
import { LoginUseCaseService } from './application/use-cases/login.use-case.service';

// Adaptadores Out (Infraestructura)
import { MongoUserRepository } from './infrastructure/adapters/out/mongo-user.repository.service';
import { BcryptPasswordHasherAdapter } from './infrastructure/adapters/out/bcrypt-password-hasher.adapter.service';
import { JwtTokenGeneratorAdapter } from './infrastructure/adapters/out/jwt-token-generator.adapter.service';

import { JwtStrategy } from './infrastructure/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || 'kambista-secreto-dev',
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: BcryptPasswordHasherAdapter,
    },
    {
      provide: TOKEN_GENERATOR_PORT,
      useClass: JwtTokenGeneratorAdapter,
    },
    {
      provide: REGISTER_USER_USE_CASE,
      useClass: RegisterUserUseCaseService,
    },
    {
      provide: LOGIN_USE_CASE,
      useClass: LoginUseCaseService,
    },
    JwtStrategy,
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
