import {
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class SaveCategoryDTO {
  @IsString()
  @Length(4, 50)
  @IsNotEmpty()
  @IsLowercase()
  name: string;

  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  parentId?: string;
}
