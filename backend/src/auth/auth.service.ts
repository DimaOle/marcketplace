import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogInDTO, RegisterDTO } from './dto';
import * as bcrypt from 'bcrypt';

import {
  userAuthSelect,
  UserResponseWithAccesToken,
  userSelect,
} from 'src/common/prisma-select';
import { CookieService } from './cookie.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { payloadOfSession } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private cookieService: CookieService,
    private config: ConfigService,
    private tokenService: TokenService,
  ) {}

  async register(
    dto: RegisterDTO,
    userAgent,
    ip,
    resp,
  ): Promise<UserResponseWithAccesToken> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (user) {
      throw new UnauthorizedException('try another email');
    }

    const hashPassword = await bcrypt.hash(dto.password, 10);

    const createUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: userSelect,
    });
    const { id, email, role } = createUser;

    const token = await this.tokenService.createTokensAuth({
      type: 'register',
      id: id,
      email: email,
      role: role,
      userAgent: userAgent,
      ip: ip,
    });
    this.cookieService.setRefreshToken(resp, token.refreshToken);
    return { ...createUser, accessToken: token.accessToken };
  }

  async logIn(
    dto: LogInDTO,
    resp: Response,
    ip,
    userAgent,
  ): Promise<UserResponseWithAccesToken> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      select: userAuthSelect,
    });

    if (!user) {
      throw new UnauthorizedException('incorecty password or email');
    }

    const matchPasswords = await bcrypt.compare(dto.password, user.password);
    if (!matchPasswords) {
      throw new UnauthorizedException('incorecty password or email');
    }

    const { id, email, role } = user;

    const token = await this.tokenService.createTokensAuth({
      type: 'login',
      id: id,
      email: email,
      role: role,
      userAgent: userAgent,
      ip: ip,
    });
    this.cookieService.setRefreshToken(resp, token.refreshToken);
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, accessToken: token.accessToken };
  }
  async getRefreshToken(
    refreshToken: string,
    resp: Response,
  ): Promise<{ accessToken: string }> {
    try {
      const payloadSession: payloadOfSession = await this.jwt.verifyAsync(
        refreshToken,
        {
          secret: this.config.get('REFRESH_SECRET'),
        },
      );
      const session = await this.prisma.token.findUnique({
        where: { id: payloadSession.sid },
      });
      const match = await bcrypt.compare(refreshToken, session.refreshToken);
      if (!match) {
        await this.prisma.token.deleteMany({
          where: { userId: session.userId },
        });
      }
      const user = await this.prisma.user.findUnique({
        where: { id: session.userId },
      });

      const { id, email, role } = user;

      const token = await this.tokenService.createTokensAuth({
        type: 'refresh',
        id: id,
        email: email,
        role: role,
        sid: payloadSession.sid,
      });
      this.cookieService.setRefreshToken(resp, token.refreshToken);
      return { accessToken: token.accessToken };
    } catch (e) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  async logOut(refreshToken, resp: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payloadSession: payloadOfSession = await this.jwt.verifyAsync(
        refreshToken,
        {
          secret: this.config.get('REFRESH_SECRET'),
        },
      );
      const session = await this.prisma.token.findUnique({
        where: { id: payloadSession.sid },
      });
      const match = await bcrypt.compare(refreshToken, session.refreshToken);
      if (!match) {
        await this.prisma.token.deleteMany({
          where: { userId: session.userId },
        });
        this.cookieService.cleanRefreshToken(resp);
        return { success: true };
      }
      await this.prisma.token.deleteMany({
        where: { id: session.id },
      });
      this.cookieService.cleanRefreshToken(resp);
      return { success: true };
    } catch (e) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
