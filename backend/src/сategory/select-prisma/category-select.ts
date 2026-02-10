import { Prisma } from 'src/generated/prisma/client';

export const CategorySelect: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
};

export type CategoryResponse = Prisma.CategoryGetPayload<{
  select: typeof CategorySelect;
}>;
