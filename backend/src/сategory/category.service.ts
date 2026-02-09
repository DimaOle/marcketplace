import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveCategoryDTO } from './dto';
import slugify from 'slugify';
import { CategoryResponse, CategorySelect } from './response';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveCategory(dto: SaveCategoryDTO): Promise<CategoryResponse> {
    const category = await this.prisma.category.findFirst({
      where: { name: dto.name },
    });

    if (category) {
      throw new ConflictException('The category has already been added');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name),
      },
      select: CategorySelect,
    });
  }
}
