import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from '../../../application/ports/out/token-generator.port.interface';

@Injectable()
export class JwtTokenGeneratorAdapter implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string, role: string): string {
    return this.jwtService.sign({ sub: userId, role }, { expiresIn: '15m' });
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
  }
}