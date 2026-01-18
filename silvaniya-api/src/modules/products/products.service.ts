import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { generateSlug, generateUniqueSlug } from '../../common/utils/slug.util';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Public methods
  async findAll(filters: ProductFilterDto, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const sortBy = pagination.sortBy ?? 'createdAt';
    const sortOrder = pagination.sortOrder ?? 'desc';
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(filters.categoryId && {
        categories: { some: { categoryId: filters.categoryId } },
      }),
      ...(filters.categorySlug && {
        categories: { some: { category: { slug: filters.categorySlug } } },
      }),
      ...(filters.collectionSlug && {
        collections: { some: { collection: { slug: filters.collectionSlug } } },
      }),
      ...(filters.minPrice !== undefined && {
        basePrice: { gte: filters.minPrice },
      }),
      ...(filters.maxPrice !== undefined && {
        basePrice: { lte: filters.maxPrice },
      }),
      ...(filters.inStock && {
        variants: { some: { stock: { gt: 0 }, isActive: true } },
      }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { shortDesc: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          variants: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              stock: true,
              isActive: true,
            },
          },
          categories: {
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
          reviews: {
            where: { status: 'APPROVED' },
            select: { rating: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Transform products to include computed fields
    const transformedProducts = products.map((product) => {
      const reviewCount = product.reviews.length;
      const avgRating =
        reviewCount > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        basePrice: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        purity: product.purity,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        primaryImage: product.images[0] || null,
        variants: product.variants,
        categories: product.categories.map((pc) => pc.category),
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount,
      };
    });

    return paginate(transformedProducts, total, page, limit);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            attributes: {
              include: {
                attributeValue: {
                  include: { attributeType: true },
                },
              },
            },
          },
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    // Get related products
    const categoryIds = product.categories.map((pc) => pc.categoryId);
    const relatedProducts = await this.prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        categories: { some: { categoryId: { in: categoryIds } } },
      },
      take: 8,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true }, take: 1 },
      },
    });

    // Calculate ratings
    const reviewCount = product.reviews.length;
    const avgRating =
      reviewCount > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    return {
      ...product,
      categories: product.categories.map((pc) => pc.category),
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        comparePrice: v.comparePrice,
        weight: v.weight,
        stock: v.stock,
        isActive: v.isActive,
        attributes: v.attributes.map((a) => ({
          type: a.attributeValue.attributeType.displayName,
          value: a.attributeValue.displayValue,
        })),
      })),
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        userName: `${r.user.firstName || ''} ${r.user.lastName?.[0] || ''}.`.trim(),
        isVerified: r.isVerified,
        createdAt: r.createdAt,
      })),
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount,
      relatedProducts: relatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        primaryImage: p.images[0] || null,
        startingPrice: p.variants[0]?.price || p.basePrice,
      })),
    };
  }

  async findFeatured(limit = 8) {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      primaryImage: p.images[0] || null,
      startingPrice: p.variants[0]?.price || p.basePrice,
    }));
  }

  async findNewArrivals(limit = 8) {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isNew: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      primaryImage: p.images[0] || null,
      startingPrice: p.variants[0]?.price || p.basePrice,
    }));
  }

  // Admin methods
  async adminFindAll(pagination: PaginationDto, search?: string) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const sortBy = pagination.sortBy ?? 'createdAt';
    const sortOrder = pagination.sortOrder ?? 'desc';
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          variants: { select: { id: true, stock: true } },
          categories: {
            include: { category: { select: { name: true } } },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const transformedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      basePrice: p.basePrice,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      primaryImage: p.images[0]?.url || null,
      totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
      variantCount: p.variants.length,
      categories: p.categories.map((pc) => pc.category.name),
      createdAt: p.createdAt,
    }));

    return paginate(transformedProducts, total, page, limit);
  }

  async adminFindById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          orderBy: { sortOrder: 'asc' },
          include: {
            attributes: {
              include: {
                attributeValue: {
                  include: { attributeType: true },
                },
              },
            },
          },
        },
        categories: {
          include: { category: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    // Generate unique slug
    let slug = generateSlug(dto.name);
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      slug = generateUniqueSlug(dto.name);
    }

    // Check SKU uniqueness if provided
    if (dto.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });
      if (existingSku) {
        throw new ConflictException('SKU already exists');
      }
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        shortDesc: dto.shortDesc,
        description: dto.description,
        basePrice: dto.basePrice,
        compareAtPrice: dto.compareAtPrice,
        costPrice: dto.costPrice,
        sku: dto.sku,
        weight: dto.weight,
        purity: dto.purity || '925',
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        isNew: dto.isNew ?? true,
        metaTitle: dto.metaTitle,
        metaDesc: dto.metaDesc,
        categories: dto.categoryIds
          ? {
              create: dto.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
      },
    });

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    // Handle slug update
    let slug = existing.slug;
    if (dto.name && dto.name !== existing.name) {
      slug = generateSlug(dto.name);
      const existingSlug = await this.prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingSlug) {
        slug = generateUniqueSlug(dto.name);
      }
    }

    // Handle category update
    if (dto.categoryIds) {
      await this.prisma.productCategory.deleteMany({
        where: { productId: id },
      });
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        shortDesc: dto.shortDesc,
        description: dto.description,
        basePrice: dto.basePrice,
        compareAtPrice: dto.compareAtPrice,
        costPrice: dto.costPrice,
        sku: dto.sku,
        weight: dto.weight,
        purity: dto.purity,
        isActive: dto.isActive,
        isFeatured: dto.isFeatured,
        isNew: dto.isNew,
        metaTitle: dto.metaTitle,
        metaDesc: dto.metaDesc,
        categories: dto.categoryIds
          ? {
              create: dto.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
      include: {
        images: true,
        variants: true,
        categories: { include: { category: true } },
      },
    });

    return product;
  }

  async delete(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  async toggleStatus(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  }
}
