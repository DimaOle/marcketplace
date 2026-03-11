import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  parentId?: string;

  @IsUUID()
  id: string;
}
