import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  accessToken,
  CreateTokensOptions,
  refreshToken,
  refreshTokenWhithSid,
} from './interfaces';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async createTokensAuth(
    option: CreateTokensOptions,
  ): Promise<accessToken & refreshToken> {
    const { type, id, email, role, userAgent, ip, sid } = option;
    if (type === 'refresh' && !sid) {
      throw new BadRequestException('sid is required');
    }

    if (type !== 'refresh' && (!ip || !userAgent)) {
      throw new BadRequestException('ip or userAgent is required');
    }

    const tokenAccess = await this.createAccessJwtToken(id, email, role);
    const tokenRefresh = await this.createRefreshJwtToken(id);
    const hashToken = await bcrypt.hash(tokenRefresh.refreshToken, 10);
    if (type === 'login') await this.clearSession(id);
    if (type !== 'refresh') {
      await this.prisma.token.create({
        data: {
          id: tokenRefresh.sid,
          refreshToken: hashToken,
          userAgent,
          ip,
          userId: id,
        },
      });
    } else {
      await this.prisma.token.update({
        where: { id: sid },
        data: { refreshToken: hashToken, id: tokenRefresh.sid },
      });
    }

    return { ...tokenAccess, ...tokenRefresh };
  }

  async createAccessJwtToken(
    id: string,
    email: string,
    role: string,
  ): Promise<accessToken> {
    const payload = { userId: id, email, role };
    return { accessToken: await this.jwt.signAsync(payload) };
  }

  async createRefreshJwtToken(userId: string): Promise<refreshTokenWhithSid> {
    const v4 = uuidv4();
    const payload = { sid: v4, userId: userId };
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('REFRESH_SECRET'),
      expiresIn: this.config.get('REFRESH_EXP'),
    });

    return {
      refreshToken: token,
      sid: v4,
    };
  }

  private async clearSession(userId: string, limit = 5) {
    const oldSession = await this.prisma.token.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: limit - 1,
      select: { id: true },
    });
    if (oldSession.length > 0) {
      const arrSession = oldSession.map((el) => el.id);
      await this.prisma.token.deleteMany({ where: { id: { in: arrSession } } });
    }
  }
}
