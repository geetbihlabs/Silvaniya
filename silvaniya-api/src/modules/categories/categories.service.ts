import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    return categories;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        parent: true,
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(data: { name: string; slug?: string; parentId?: string; description?: string }) {
    const slug = data.slug || generateSlug(data.name);
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        parent: data.parentId ? { connect: { id: data.parentId } } : undefined,
      },
    });
  }

  async update(id: string, data: { name?: string; description?: string; isActive?: boolean }) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
