import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  async getBanners(position?: string) {
    return this.prisma.banner.findMany({
      where: { isActive: true, ...(position && { position }) },
      orderBy: { sortOrder: 'asc' }
    });
  }

  async getPages() {
    return this.prisma.page.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDesc: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async getPageBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
    });

    if (!page || !page.isPublished) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }
}
