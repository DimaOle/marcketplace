import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { createJwtOptions } from './config';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [JwtModule.registerAsync(createJwtOptions())],
  exports: [JwtModule],
})
export class AuthModule {}
