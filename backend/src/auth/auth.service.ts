import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogInDTO, RegisterDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {
  userAuthSelect,
  UserResponseWithAccesToken,
  userSelect,
} from 'src/common/prisma-select';
import { CookieService } from './cookie.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private cookieService: CookieService,
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

    const token = await this.createAccessJwtToken(id, email, role);
    const refresh = await this.createRefreshJwtToken(id);
    await this.prisma.token.create({
      data: {
        refreshToken: refresh.refreshToken,
        userAgent,
        ip,
        userId: id,
      },
    });
    this.cookieService.setRefreshToken(resp, refresh.refreshToken);
    return { ...createUser, ...token };
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

    const jwt = await this.createAccessJwtToken(user.id, user.email, user.role);
    const refresh = await this.createRefreshJwtToken(user.id);
    const hashToken = await bcrypt.hash(refresh.refreshToken, 10);
    await this.prisma.token.create({
      data: {
        refreshToken: hashToken,
        userAgent,
        ip,
        userId: user.id,
      },
    });
    this.cookieService.setRefreshToken(resp, refresh.refreshToken);
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, ...jwt };
  }

  async logOut(refreshToken: string, resp: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    await this.prisma.token.deleteMany({
      where: {
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIyYzM3MTk1My04MzliLTRkZWQtODQwMi1hMzhkNTRjZmU2NTIiLCJ1c2VySWQiOiJjMDE1NjBmNC0wNTJlLTRiNjEtODQ4ZC1kYzkwZGI3NTNlMWMiLCJpYXQiOjE3NzIwNDgzNTMsImV4cCI6MTc3MjA0ODk1M30.iK_a8dne6d7BGb-yKfFxJ9JnQgsSruiPBm384Qo9pAI',
      },
    });
    this.cookieService.cleanRefreshToken(resp);
    return { success: true };
  }

  private async createAccessJwtToken(
    id: string,
    email: string,
    role: string,
  ): Promise<{ accessToken: string }> {
    const payload = { userId: id, email, role };
    return { accessToken: await this.jwt.signAsync(payload) };
  }

  private async createRefreshJwtToken(
    userId: string,
  ): Promise<{ refreshToken: string }> {
    const v4 = uuidv4();
    const payload = { sid: v4, userId: userId };
    return { refreshToken: await this.jwt.signAsync(payload) };
  }
}
