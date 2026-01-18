import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminAuthController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
