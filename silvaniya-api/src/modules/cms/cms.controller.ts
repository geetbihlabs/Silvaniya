import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('cms')
@Controller('cms')
@Public()
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('banners')
  @ApiOperation({ summary: 'Get active banners' })
  async getBanners(@Query('position') position?: string) {
    return this.cmsService.getBanners(position);
  }

  @Get('pages')
  @ApiOperation({ summary: 'Get all published pages' })
  async getPages() {
    return this.cmsService.getPages();
  }

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get page by slug' })
  async getPageBySlug(@Param('slug') slug: string) {
    return this.cmsService.getPageBySlug(slug);
  }
}
