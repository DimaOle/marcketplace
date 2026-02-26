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
    const hashToken = await bcrypt.hash(refresh.refreshToken, 10);
    await this.prisma.token.create({
      data: {
        refreshToken: hashToken,
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

  async logOut(userId: string, token, resp: Response) {
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const userTokens = await this.prisma.token.findMany({
      where: {
        userId,
      },
    });

    if (userTokens.length == 0) {
      return { success: true };
    }

    for (let i = 0; i < userTokens.length; i++) {
      const validToken = await bcrypt.compare(
        token,
        userTokens[i].refreshToken,
      );
      console.log(validToken);
      if (validToken) {
        await this.prisma.token.deleteMany({ where: { id: userTokens[i].id } });
        this.cookieService.cleanRefreshToken(resp);
        return { success: true };
      }
    }
    await this.prisma.token.deleteMany({ where: { userId } });
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
