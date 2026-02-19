import { Prisma } from 'src/generated/prisma/client';
import { CategorySelect } from 'src/сategory/select-prisma';

export const ProductSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  stock: true,
  images: true,
  categoryId: true,
  category: {
    select: CategorySelect,
  },
} as const;

export type ProductResponse = Prisma.ProductGetPayload<{
  select: typeof ProductSelect;
}>;
