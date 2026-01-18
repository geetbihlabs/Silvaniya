import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Amethyst Silver Ring' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Beautiful 925 sterling silver ring' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDesc?: string;

  @ApiPropertyOptional({ example: '<p>Full description...</p>' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2499.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ example: 2999.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ example: 'SIL-RING-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sku?: string;

  @ApiPropertyOptional({ example: 5.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: '925', default: '925' })
  @IsOptional()
  @IsString()
  purity?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @ApiPropertyOptional({ example: 'Buy Amethyst Silver Ring | Silvaniya' })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'Shop authentic 925 sterling silver...' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDesc?: string;

  @ApiPropertyOptional({ example: ['cat1', 'cat2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
