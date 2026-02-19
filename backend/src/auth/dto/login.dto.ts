import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LogInDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'try another password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50, { message: 'Try another email' })
  email: string;
}
