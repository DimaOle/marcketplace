import { Category } from 'src/generated/prisma/client';

export const CategorySelect = {
  id: true,
  name: true,
  slug: true,
  parentId: true,
  path: true,
  rootId: true,
} as const;

export type CategoryResponse = Pick<Category, keyof typeof CategorySelect>;
