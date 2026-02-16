import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CategoryService } from './category.service';
import { Prisma, PrismaClient } from 'src/generated/prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategorySelect } from './select-prisma';
import { ConflictException } from '@nestjs/common';

describe('categoryService', () => {
  let category: CategoryService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    category = module.get<CategoryService>(CategoryService);
  });

  describe('saveCategory', () => {
    const dto = {
      name: 'household appliances',
      slug: 'electronics',
    };

    it('must saccessfully create a category', async () => {
      const mockIdCategory = { id: 'adc0813c-28b0-4244-8be0-772465939213' };
      const mockSlug = dto.name.split(' ').join('-');
      const mockResponse = { ...mockIdCategory, ...dto, slug: mockSlug };
      prismaMock.category.create.mockResolvedValue(mockResponse as any);

      const result = await category.saveCategory(dto);
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: { ...dto, slug: mockSlug },
        select: CategorySelect,
      });
      expect(result).toEqual(mockResponse);
    });

    it('throw if category find', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { modelName: 'Category' }, // Важно для твоего фильтра
        },
      );
      prismaMock.category.create.mockRejectedValue(prismaError);

      await expect(category.saveCategory(dto)).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
      expect(prismaMock.product.create).not.toHaveBeenCalled();
    });
  });

  describe('getCategory', () => {
    it('Should show all categories', async () => {
      const mockResponse = [
        {
          id: '923acef2-3107-43a5-8741-d64905a72131',
          name: 'electronics',
          slug: 'electronics',
        },
        {
          id: 'adc0813c-28b0-4244-8be0-772465939213',
          name: 'household appliances',
          slug: 'household-appliances',
        },
      ];

      prismaMock.category.findMany.mockResolvedValue(mockResponse as any);
      const result = await category.getCategory();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
    });
  });
});
