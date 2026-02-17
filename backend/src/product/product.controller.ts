import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO, SearchProductDTO } from './dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDTO) {
    return this.productService.createProduct(dto);
  }

  @Get()
  getAll(@Query() dto: SearchProductDTO) {
    console.log(dto);
    return this.productService.getAllProduct(dto);
  }
}
