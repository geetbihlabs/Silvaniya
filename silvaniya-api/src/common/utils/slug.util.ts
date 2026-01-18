import slugify from 'slugify';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function generateUniqueSlug(text: string): string {
  const baseSlug = generateSlug(text);
  const uniqueSuffix = nanoid();
  return `${baseSlug}-${uniqueSuffix}`;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = customAlphabet('0123456789', 4)();
  return `SIL-${dateStr}-${randomPart}`;
}

export function generateSKU(
  prefix: string,
  category: string,
  variant: string,
): string {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const variantCode = variant.substring(0, 4).toUpperCase();
  const random = customAlphabet('0123456789', 3)();
  return `${prefix}-${categoryCode}-${variantCode}-${random}`;
}
