import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('vendors')
@Controller('vendors')
@Public()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active vendors' })
  async findAll(@Query('featured') featured?: string) {
    const isFeatured = featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.vendorsService.findAllVendors(isFeatured);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get vendor products with filters' })
  async findProducts(
    @Query('vendor') vendorSlug?: string,
    @Query('category') category?: string,
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.vendorsService.findVendorProducts({
      vendorSlug,
      category,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
    });
  }

  @Get('products/featured')
  @ApiOperation({ summary: 'Get featured vendor products' })
  async findFeaturedProducts(@Query('limit') limit?: string) {
    return this.vendorsService.findFeaturedVendorProducts(limit ? parseInt(limit, 10) : undefined);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get vendor by slug with products' })
  async findBySlug(@Param('slug') slug: string) {
    return this.vendorsService.findVendorBySlug(slug);
  }
}
