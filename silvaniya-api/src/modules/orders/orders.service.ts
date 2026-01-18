import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  
  async findByUser(userId: string) { return []; }
  async findById(id: string) { return null; }
}
