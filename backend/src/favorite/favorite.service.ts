import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorite } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async toggle(productId: string, userId: string): Promise<Favorite> {
    const product = await this.productService.getProductById(productId);

    if (!product) throw new NotFoundException(`${productId} not found`);

    const itemInFavorite = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (itemInFavorite) {
      return this.prisma.favorite.delete({
        where: { userId_productId: { userId, productId } },
      });
    }

    return this.prisma.favorite.create({
      data: {
        productId,
        userId,
      },
    });
  }

  async getAllFavoritesByUserId(userId: string): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({ where: { userId } });
  }
}
