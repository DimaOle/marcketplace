import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  IJwtAccessPayload,
  IJwtRefreshPayload,
  payloadOfSession,
} from './interfaces';

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
  async signAsync(
    payload: IJwtRefreshPayload | IJwtAccessPayload,
    options?: JwtSignOptions,
  ) {
    const token = await this.jwtService.signAsync(payload, options);
    return token;
  }
}
