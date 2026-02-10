import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDTO } from './dto';
import { ProductResponse, ProductSelect } from './select-prisma';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDTO): Promise<ProductResponse> {
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `category by id - ${dto.categoryId} don't found`,
      );
    }

    return await this.prisma.product.create({
      data: dto,
      select: ProductSelect,
    });
  }

  async getAllProduct(): Promise<ProductResponse[]> {
    return this.prisma.product.findMany({ select: ProductSelect });
  }
}
