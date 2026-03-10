import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { createJwtOptions } from './config';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TokenStorage } from './base';
import {
  CookieService,
  HashService,
  JwtAuthService,
  TokenPrismaService,
  TokenService,
} from './services';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    CookieService,
    TokenService,
    HashService,
    JwtAuthService,
    {
      provide: TokenStorage,
      useClass: TokenPrismaService,
    },
  ],
  imports: [UserModule, JwtModule.registerAsync(createJwtOptions())],
  exports: [JwtModule],
})
export class AuthModule {}
