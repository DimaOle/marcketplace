import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports: [AuthModule, ProductModule],
})
export class FavoriteModule {}
