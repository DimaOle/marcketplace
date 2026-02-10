import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @Length(5, 40)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  description: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  price: string;

  @IsNumber()
  stock: number;

  @IsOptional()
  images: string[];

  @IsUUID()
  categoryId: string;
}
