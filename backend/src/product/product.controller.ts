import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDTO) {
    return this.productService.createProduct(dto);
  }

  @Get()
  getAll() {
    return this.productService.getAllProduct();
  }
}
