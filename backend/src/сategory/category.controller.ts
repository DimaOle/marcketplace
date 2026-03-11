import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { SaveCategoryDTO, UpdateCategoryDTO } from './dto';
import { Roles } from 'src/common/decorators';
import { AuthGuard, RoleGuard } from 'src/common/guards';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(['ADMIN'])
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  save(@Body() dto: SaveCategoryDTO) {
    return this.categoryService.saveCategory(dto);
  }

  @Get()
  get() {
    return this.categoryService.getCategory();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch()
  update(@Body() dto: UpdateCategoryDTO) {
    return this.categoryService.updateCategory(dto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
