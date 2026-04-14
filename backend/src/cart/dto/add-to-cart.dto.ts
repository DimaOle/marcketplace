import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class AddCartDTO {
  @IsString()
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
