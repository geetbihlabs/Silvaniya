import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductFilterDto } from './dto/product-filter.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('products')
@Controller('products')
@Public()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products with filters and pagination' })
  async findAll(@Query() filters: ProductFilterDto) {
    const { page, limit, sortBy, sortOrder, ...filterParams } = filters;
    return this.productsService.findAll(filterParams, { page, limit, sortBy, sortOrder });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  async findFeatured(@Query('limit') limit?: number) {
    return this.productsService.findFeatured(limit);
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get new arrival products' })
  async findNewArrivals(@Query('limit') limit?: number) {
    return this.productsService.findNewArrivals(limit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
