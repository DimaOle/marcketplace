import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCartDTO } from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) return { totalPrice: 0 };

    const totalPrice = cart.items.reduce((acc, item) => {
      const allPrice = item.product.price.mul(item.quantity);
      return acc.plus(allPrice);
    }, new Prisma.Decimal(0));

    return { ...cart, totalPrice };
  }

  async addToCart(userId: string, dto: AddCartDTO) {
    const { productId, quantity } = dto;

    let cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { productId, cartId: cart.id },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
        price: product.price,
      },
    });
  }
}
