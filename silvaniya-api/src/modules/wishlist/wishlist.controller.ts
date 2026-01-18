import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getAll(@CurrentUser('sub') userId: string) {
    return this.wishlistService.getByUser(userId);
  }

  @Post(':productId')
  async add(@CurrentUser('sub') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.add(userId, productId);
  }

  @Delete(':productId')
  async remove(@CurrentUser('sub') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.remove(userId, productId);
  }
}
