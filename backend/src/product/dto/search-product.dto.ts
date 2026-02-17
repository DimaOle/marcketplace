import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PAGINATION_DEFAULTS } from 'src/common/constatnts';

export class SearchProductDTO {
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
}
