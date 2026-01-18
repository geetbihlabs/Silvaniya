import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('coupons')
@Controller('coupons')
@Public()
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  async validate(@Body() body: { code: string; cartTotal: number }) {
    return this.couponsService.validate(body.code, body.cartTotal);
  }
}
