import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as ms from 'ms';

@Injectable()
export class CookieService {
  constructor(private config: ConfigService) {}
  private get prod() {
    return this.config.get('NODE_ENV');
  }

  setRefreshToken(resp: Response, refreshToken) {
    const expTime = this.config.get('REFRESH_EXP');
    const time = Number(ms(expTime));
    resp.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: time,
      secure: this.prod,
    });
  }

  cleanRefreshToken(resp: Response) {
    resp.cookie('refreshToken', '', {
      httpOnly: true,
      secure: this.prod,
      sameSite: 'lax',
      maxAge: 0,
    });
  }
}
