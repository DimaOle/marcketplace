import { IsLowercase, IsNotEmpty, IsString, Length } from 'class-validator';

export class SaveCategoryDTO {
  @IsString()
  @Length(4, 50)
  @IsNotEmpty()
  @IsLowercase()
  name: string;
}
