import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  
  async validateAdmin(email: string, password: string) {
    // Implementation placeholder
    return null;
  }
}
