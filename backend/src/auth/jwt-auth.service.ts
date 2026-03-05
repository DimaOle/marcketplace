import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { payloadOfSession } from './interfaces';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async verifAsync(
    refreshToken: string,
    secret: string,
  ): Promise<payloadOfSession> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret,
      });
      return payload;
    } catch (e) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
