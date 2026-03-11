import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { PAGINATION_DEFAULTS } from 'src/common/constatnts';
import { ProductSortFields } from '../enums/enums';

export class SearchProductDTO {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(1000000)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(1000000)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000000)
  page: number = PAGINATION_DEFAULTS.PAGE;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = PAGINATION_DEFAULTS.LIMIT;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsEnum(ProductSortFields)
  sort?: string;
}
