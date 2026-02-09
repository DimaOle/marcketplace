import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { SaveCategoryDTO } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  getAll(@Body() dto: SaveCategoryDTO) {
    return this.categoryService.saveCategory(dto);
  }
}
