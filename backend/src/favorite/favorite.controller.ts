import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards';
import { FavoriteService } from './favorite.service';
import { DataFromUser } from 'src/common/decorators';

@UseGuards(AuthGuard)
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('toggle/:id')
  toggleFavorite(
    @Param('id') productId: string,
    @DataFromUser('userId') userId: string,
  ) {
    return this.favoriteService.toggle(productId, userId);
  }

  @Get('all')
  favoriteByUserId(@DataFromUser('userId') userId: string) {
    return this.favoriteService.getAllFavoritesByUserId(userId);
  }
}
