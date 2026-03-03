import {
  Body,
  Controller,
  Delete,
  Headers,
  Ip,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO, RegisterDTO } from './dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards';
import { CookieFromReq, DataFromUser } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() dto: RegisterDTO,
    @Ip() ip: string,
    @Res({ passthrough: true }) resp: Response,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.register(dto, userAgent, ip, resp);
  }

  @Post('logIn')
  logIn(
    @Body() dto: LogInDTO,
    @Res({ passthrough: true }) resp: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.logIn(dto, resp, ip, userAgent);
  }

  @Patch('refreshToken')
  refreshToken(
    @CookieFromReq('refreshToken') token: string,
    @Res({ passthrough: true })
    resp: Response,
  ) {
    return this.authService.getRefreshToken(token, resp);
  }

  @Delete('logOut')
  @UseGuards(AuthGuard)
  logOut(
    @CookieFromReq('refreshToken') token: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    return this.authService.logOut(token, resp);
  }
}
