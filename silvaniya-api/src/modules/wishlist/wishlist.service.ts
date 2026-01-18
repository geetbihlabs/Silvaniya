import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}
  
  async getByUser(userId: string) { return []; }
  async add(userId: string, productId: string) { return { message: 'Added' }; }
  async remove(userId: string, productId: string) { return { message: 'Removed' }; }
}
