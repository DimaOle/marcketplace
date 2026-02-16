import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service'; // твой путь
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { ProductSelect } from './select-prisma';

describe('ProductService', () => {
  let service: ProductService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  describe('createProduct', () => {
    const dto = {
      title: 'washing machine',
      description: `Whirlpool WRBSB 6228 B UA`,
      price: '13999',
      stock: 50,
      images: ['https://link12.com', 'https://link13.com'],
      categoryId: '923acef2-3107-43a5-8741-d64905a72131',
    };

    it('must successfully create a product if the category exists', async () => {
      const mockCategory = { id: 'cat-id-123', name: 'electronics' };
      const mockResponse = {
        id: 'a3f6c498-dc71-4074-b262-89667a2a1ca7',
        ...dto,
        category: {
          id: '923acef2-3107-43a5-8741-d64905a72131',
          name: 'electronics',
          slug: 'electronics',
        },
      };
      prismaMock.category.findFirst.mockResolvedValue(mockCategory as any);
      prismaMock.product.create.mockResolvedValue(mockResponse as any);

      const result = await service.createProduct(dto);

      expect(result).toHaveProperty(
        'id',
        'a3f6c498-dc71-4074-b262-89667a2a1ca7',
      );
      expect(result).toHaveProperty(
        'category.id',
        '923acef2-3107-43a5-8741-d64905a72131',
      );
      expect(prismaMock.product.create).toHaveBeenCalledWith({
        data: dto,
        select: ProductSelect,
      });
      expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
        where: { id: dto.categoryId },
      });
    });

    it('should throw NotFoundException if the category does not exist', async () => {
      prismaMock.category.findFirst.mockResolvedValue(null);
      await expect(service.createProduct(dto)).rejects.toThrow(
        new NotFoundException(`category by id - ${dto.categoryId} don't found`),
      );
      expect(prismaMock.product.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllProduct', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          title: 'washing machine',
          description: `Whirlpool WRBSB 6228 B UA`,
          price: '13999',
          stock: 50,
          images: ['https://link12.com', 'https://link13.com'],
          categoryId: '923acef2-3107-43a5-8741-d64905a72131',
          category: {
            id: '923acef2-3107-43a5-8741-d64905a72131',
            name: 'electronics',
            slug: 'electronics',
          },
        },
        {
          title: 'washing machine',
          description: `Whirlpool WRBSB 6228 B UA`,
          price: '13999',
          stock: 50,
          images: ['https://link15.com', 'https://link13.com'],
          categoryId: '923acef2-3107-43a5-8741-d64905a72131',
          category: {
            id: '923acef2-3107-43a5-8741-d64905a72131',
            name: 'electronics',
            slug: 'electronics',
          },
        },
      ];
      prismaMock.product.findMany.mockResolvedValue(mockProducts as any);

      const result = await service.getAllProduct();

      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(2);
    });
  });
});
