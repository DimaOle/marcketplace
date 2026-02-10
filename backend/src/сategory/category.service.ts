import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveCategoryDTO } from './dto';
import slugify from 'slugify';
import { CategoryResponse, CategorySelect } from './select-prisma';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  saveCategory(dto: SaveCategoryDTO): Promise<CategoryResponse> {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name),
      },
      select: CategorySelect,
    });
  }

  getCategory(): Promise<CategoryResponse[]> {
    return this.prisma.category.findMany({ select: CategorySelect });
  }
}
