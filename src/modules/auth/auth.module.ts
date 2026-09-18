import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/adapters/in/auth/auth.controller.js';
import { AuthService } from './application/use-cases/auth/auth.service.js';
import { MongoUserRepositoryService } from './infrastructure/adapters/out/mongo-user.repository/mongo-user.repository.service.js';
import { RegisterUserUseCaseService } from './application/use-cases/register-user.use-case.service';
import { LoginUseCaseService } from './application/use-cases/login.use-case.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MongoUserRepositoryService, RegisterUserUseCaseService, LoginUseCaseService]
})
export class AuthModule {}
