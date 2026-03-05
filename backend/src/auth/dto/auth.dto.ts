import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTokensDto {
  @IsEnum(['login', 'register', 'refresh'])
  type: 'login' | 'register' | 'refresh';

  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsIP()
  ip?: string;

  @IsOptional()
  @IsString()
  sid?: string;
}
