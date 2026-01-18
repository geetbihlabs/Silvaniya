import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, AdminRole } from '../../common/decorators/roles.decorator';

@ApiTags('admin/products')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductsAdminController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(AdminRole.VIEWER)
  @ApiOperation({ summary: 'List all products (admin)' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.productsService.adminFindAll(pagination, search);
  }

  @Get(':id')
  @Roles(AdminRole.VIEWER)
  @ApiOperation({ summary: 'Get product by ID (admin)' })
  async findById(@Param('id') id: string) {
    return this.productsService.adminFindById(id);
  }

  @Post()
  @Roles(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Create product' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @Roles(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Update product' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Delete product' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch(':id/status')
  @Roles(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Toggle product active status' })
  async toggleStatus(@Param('id') id: string) {
    return this.productsService.toggleStatus(id);
  }
}
