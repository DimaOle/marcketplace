import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { accessToken, refreshToken, refreshTokenWhithSid } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateTokensDto } from '../dto';
import { TokenStorage } from '../base';
import { HashService, JwtAuthService } from '../services';

@Injectable()
export class TokenService {
  constructor(
    private config: ConfigService,
    private hashService: HashService,
    private readonly storage: TokenStorage,
    private jwtAuthService: JwtAuthService,
  ) {}

  async createTokensAuth(
    option: CreateTokensDto,
  ): Promise<accessToken & refreshToken> {
    const { id, email, role } = option;
    const access = await this.generatedAccess(id, email, role);
    const { refreshToken, sid } = await this.generatedRefresh(id);
    const hashedRefresh = await this.hashService.hashData(refreshToken, 10);

    await this.saveSessionStrategy(option, sid, hashedRefresh);

    return { ...access, refreshToken: refreshToken };
  }

  private async saveSessionStrategy(
    dto: CreateTokensDto,
    newSid: string,
    hash: string,
  ) {
    const strategies = {
      login: () => this.handleNewSession(dto, newSid, hash),
      register: () => this.handleNewSession(dto, newSid, hash),
      refresh: () => this.handleRefreshSession(dto, newSid, hash),
    };
    const strategy = strategies[dto.type];
    return strategy();
  }

  private async handleNewSession(
    dto: CreateTokensDto,
    sid: string,
    hash: string,
  ) {
    if (!dto.ip || !dto.userAgent) {
      throw new BadRequestException('Metadata required');
    }
    const data = {
      id: sid,
      refreshToken: hash,
      userAgent: dto.userAgent,
      ip: dto.ip,
      userId: dto.id,
    };
    await this.storage.save(data);
    await this.storage.deleteOldSessions(dto.id);
  }

  private async handleRefreshSession(
    dto: CreateTokensDto,
    newSid: string,
    hash: string,
  ) {
    const data = {
      sid: dto.sid,
      newSid: newSid,
      refreshToken: hash,
    };
    await this.storage.update(data);
  }

  private async generatedAccess(
    id: string,
    email: string,
    role: string,
  ): Promise<accessToken> {
    const payload = { userId: id, email, role };
    return {
      accessToken: await this.jwtAuthService.signAsync(payload),
    };
  }

  private async generatedRefresh(
    userId: string,
  ): Promise<refreshTokenWhithSid> {
    const v4 = uuidv4();
    const payload = { sid: v4, userId: userId };
    const token = await this.jwtAuthService.signAsync(payload, {
      secret: this.config.get('REFRESH_SECRET'),
      expiresIn: this.config.get('REFRESH_EXP'),
    });

    return {
      refreshToken: token,
      sid: v4,
    };
  }
}
