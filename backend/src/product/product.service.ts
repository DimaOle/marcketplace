import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDTO, SearchProductDTO } from './dto';
import { ProductResponse, ProductSelect } from './select-prisma';
import { Prisma } from 'src/generated/prisma/client';
import { ProductWhereInput } from 'src/generated/prisma/models';

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

  getAllProduct(dto: SearchProductDTO): Promise<ProductResponse[]> {
    const addConditions: Prisma.ProductWhereInput[] = [];
    if (dto.categorySlug)
      addConditions.push({ category: { slug: dto.categorySlug } });
    if (dto.search)
      addConditions.push({
        title: { contains: dto.search, mode: 'insensitive' },
      });
    if (dto.minPrice) addConditions.push({ price: { gte: dto.minPrice } });
    if (dto.maxPrice) addConditions.push({ price: { lte: dto.maxPrice } });
    return this.prisma.product.findMany({
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit,
      where: addConditions.length > 0 ? { AND: addConditions } : {},
      orderBy: { createdAt: 'desc' },
      select: ProductSelect,
    });
  }
}
