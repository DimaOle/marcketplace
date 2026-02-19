import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsString()
  @Length(3, 30)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'The password can be 8 letters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-zA-Z]).*$/, {
    message: 'The password must contain at least 1 letter and 1 number.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50, { message: 'Try another email' })
  email: string;
}
