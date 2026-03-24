import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveCategoryDTO, UpdateCategoryDTO } from './dto';
import slugify from 'slugify';
import { CategoryResponse, CategorySelect } from './select-prisma';
import { Category, Prisma } from 'src/generated/prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveCategory(dto: SaveCategoryDTO): Promise<CategoryResponse> {
    const { name, parentId } = dto;
    const slug = slugify(dto.name, { lower: true });

    return this.prisma.$transaction(async (tx) => {
      const category = await tx.category.create({
        data: {
          name,
          slug,
          parentId,
          rootId: '',
          path: '',
        },
      });

      let rootId = category.id;
      let path = category.id;

      if (parentId) {
        const parent = await tx.category.findUnique({
          where: { id: parentId },
        });

        if (!parent) throw new NotFoundException('parent id not found');
        rootId = parent.rootId;
        path = `${parent.path}.${category.id}`;
      }

      return tx.category.update({
        where: { id: category.id },
        data: { path, rootId },
        select: CategorySelect,
      });
    });
    // if (dto.parentId) {
    //   const parent = await this.prisma.category.findUnique({
    //     where: { id: dto.parentId },
    //   });
    //   if (!parent) {
    //     throw new NotFoundException(`parent by id - ${dto.parentId} not found`);
    //   }
    // }
    // return this.prisma.category.create({
    //   data: {
    //     name: dto.name,
    //     slug: slugify(dto.name, { lower: true }),
    //     parentId: dto.parentId,
    //     rootId: '',
    //     path: '',
    //   },
    //   select: CategorySelect,
    // });
  }

  async getCategory(): Promise<CategoryResponse[]> {
    const allCategories = await this.prisma.category.findMany({});
    const map = {};
    const tree = [];

    allCategories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    allCategories.forEach((cat) => {
      if (cat.parentId) {
        map[cat.parentId].children.push(map[cat.id]);
      } else {
        tree.push(map[cat.id]);
      }
    });
    return tree;
  }

  async updateCategory(dto: UpdateCategoryDTO): Promise<Category> {
    const { id, parentId, name } = dto;
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ${id} not found`);
    }
    const data: Prisma.CategoryUncheckedUpdateInput = {};

    if (parentId) {
      const category = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!category) {
        throw new NotFoundException(` ${parentId} not found`);
      }
      data.parentId = parentId;
    }
    if (name) {
      data.name = name;
      data.slug = slugify(name, { lower: true });
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`category by ${id} not found`);
    }
    return this.prisma.category.delete({ where: { id } });
  }
}
