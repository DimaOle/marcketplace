import { IsLowercase, IsString, Length } from 'class-validator';

export class SaveCategoryDTO {
  @IsString()
  @Length(4, 12)
  @IsLowercase()
  name: string;
}
