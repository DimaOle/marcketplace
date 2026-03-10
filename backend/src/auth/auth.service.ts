import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LogInDTO, RegisterDTO } from './dto';
import { UserResponseWithAccesToken } from 'src/common/prisma-select';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { payloadOfSession } from './interfaces';
import { UserService } from 'src/user/user.service';
import { TokenStorage } from './base';
import {
  CookieService,
  HashService,
  JwtAuthService,
  TokenService,
} from './services';

@Injectable()
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private config: ConfigService,
    private tokenService: TokenService,
    private userService: UserService,
    private hashService: HashService,
    private storage: TokenStorage,
    private jwtAuthService: JwtAuthService,
  ) {}

  async register(
    dto: RegisterDTO,
    userAgent,
    ip,
    resp,
  ): Promise<UserResponseWithAccesToken> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user) throw new UnauthorizedException('try another email');
    const hashPassword = await this.hashService.hashData(dto.password, 10);
    const data = { ...dto, password: hashPassword };
    const createUser = await this.userService.createUser(data);
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
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('incorecty password or email');
    const matchPasswords = await this.hashService.compareData(
      dto.password,
      user.password,
    );
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
    const payloadSession = await this.jwtAuthService.verifAsync(
      refreshToken,
      this.config.get('REFRESH_SECRET'),
    );
    const { sid, userId } = payloadSession;
    const session = await this.storage.findUnique(sid);
    const match = await this.hashService.compareData(
      refreshToken,
      session.refreshToken,
    );
    if (!match) {
      await this.storage.deleteByUserId(session.userId);
    }
    const user = await this.userService.getUserById(session.userId);
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
  }

  async logOut(refreshToken, resp: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const payloadSession: payloadOfSession =
      await this.jwtAuthService.verifAsync(
        refreshToken,
        this.config.get('REFRESH_SECRET'),
      );
    const { sid, userId } = payloadSession;
    const session = await this.storage.findUnique(sid);
    const match = await this.hashService.compareData(
      refreshToken,
      session.refreshToken,
    );
    if (!match) {
      await this.storage.deleteByUserId(session.userId);
      this.cookieService.cleanRefreshToken(resp);
      return { success: true };
    }
    await this.storage.deleteAllById([session.id]);
    this.cookieService.cleanRefreshToken(resp);
    return { success: true };
  }
}
