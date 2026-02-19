import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO, SearchProductDTO } from './dto';
import { AuthGuard, RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() dto: CreateProductDTO) {
    return this.productService.createProduct(dto);
  }

  @Get()
  getAll(@Query() dto: SearchProductDTO) {
    console.log(dto);
    return this.productService.getAllProduct(dto);
  }
}
