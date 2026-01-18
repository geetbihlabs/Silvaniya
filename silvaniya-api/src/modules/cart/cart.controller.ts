import { Controller, Get, Post, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('cart')
@Controller('cart')
@Public()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Headers('x-session-id') sessionId: string) {
    return this.cartService.getCart(undefined, sessionId);
  }
}
