import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { createJwtOptions } from './config';
import { AuthController } from './auth.controller';
import { CookieService } from './cookie.service';
import { TokenService } from './token.service';
import { UserModule } from 'src/user/user.module';
import { TokenPrismaService } from './token-repository.service';
import { HashService } from './hash.service';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    CookieService,
    TokenService,
    TokenPrismaService,
    HashService,
    JwtAuthService,
  ],
  imports: [UserModule, JwtModule.registerAsync(createJwtOptions())],
  exports: [JwtModule],
})
export class AuthModule {}
