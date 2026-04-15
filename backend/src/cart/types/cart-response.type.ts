import { Prisma } from 'src/generated/prisma/client';

export type CartWithItems = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type CartResponse = CartWithItems & { totalPrice: Prisma.Decimal };
