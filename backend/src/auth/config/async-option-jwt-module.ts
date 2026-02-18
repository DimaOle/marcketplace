import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export const createJwtOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService): JwtModuleOptions => ({
    secret: config.getOrThrow('SECRET_KEY'),
    signOptions: {
      expiresIn: config.getOrThrow('JWT_EXP'),
    },
  }),
});
