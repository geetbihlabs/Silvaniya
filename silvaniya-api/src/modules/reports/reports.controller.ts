import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, AdminRole } from '../../common/decorators/roles.decorator';

@ApiTags('admin/reports')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles(AdminRole.VIEWER)
  async getSales(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportsService.getSalesReport(new Date(startDate), new Date(endDate));
  }
}
