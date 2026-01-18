import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('admin/auth')
@Controller('admin/auth')
@Public()
export class AdminAuthController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return { message: 'Login endpoint' };
  }
}
