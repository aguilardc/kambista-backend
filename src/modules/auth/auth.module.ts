import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/adapters/in/auth/auth.controller.js';
import { AuthService } from './application/use-cases/auth/auth.service.js';
import { MongoUserRepositoryService } from './infrastructure/adapters/out/mongo-user.repository/mongo-user.repository.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MongoUserRepositoryService]
})
export class AuthModule {}
