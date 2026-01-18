import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async findAllVendors(featured?: boolean) {
    return this.prisma.vendor.findMany({
      where: {
        isActive: true,
        ...(featured !== undefined && { isFeatured: featured }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        city: true,
        state: true,
        isFeatured: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    });
  }

  async findVendorBySlug(slug: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!vendor || !vendor.isActive) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async findVendorProducts(options: {
    vendorSlug?: string;
    category?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }) {
    const { vendorSlug, category, featured, limit = 20, page = 1 } = options;

    const where: any = { isActive: true };

    if (vendorSlug) {
      const vendor = await this.prisma.vendor.findUnique({
        where: { slug: vendorSlug },
        select: { id: true },
      });
      if (vendor) {
        where.vendorId = vendor.id;
      }
    }

    if (category) {
      where.category = category;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    const [products, total] = await Promise.all([
      this.prisma.vendorProduct.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vendorProduct.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFeaturedVendorProducts(limit: number = 8) {
    return this.prisma.vendorProduct.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
