import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { DataFromUser } from 'src/common/decorators';
import { AuthGuard } from 'src/common/guards';
import { AddCartDTO } from './dto';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@DataFromUser('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  addCart(@DataFromUser('userId') userId: string, @Body() dto: AddCartDTO) {
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('item/:id')
  updateQuantity(
    @Param('id') itemId: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(itemId, quantity);
  }

  @Delete('item/:id')
  deleteItem(@Param('id') itemId: string) {
    return this.cartService.deleteItem(itemId);
  }
}
