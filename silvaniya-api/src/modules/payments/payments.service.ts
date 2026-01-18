import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}
  
  async createRazorpayOrder(amount: number, orderId: string) { return {}; }
  async verifyPayment(data: any) { return { success: true }; }
}
