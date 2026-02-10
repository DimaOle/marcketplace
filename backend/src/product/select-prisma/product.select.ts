import { Prisma } from 'src/generated/prisma/client';
import { CategorySelect } from 'src/сategory/select-prisma';

export const ProductSelect: Prisma.ProductSelect = {
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
};

export type ProductResponse = Prisma.ProductGetPayload<{
  select: typeof ProductSelect;
}>;
