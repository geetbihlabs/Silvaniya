import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({ example: 'Home' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  label?: string;

  @ApiProperty({ example: 'Priya' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Sharma' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @Matches(/^\+[1-9]\d{9,14}$/, {
    message: 'Phone number must be in international format',
  })
  phone: string;

  @ApiProperty({ example: '123, Green Park' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Near Metro Station' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  addressLine2?: string;

  @ApiProperty({ example: 'New Delhi' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city: string;

  @ApiProperty({ example: 'Delhi' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state: string;

  @ApiProperty({ example: '110016' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Pincode must be 6 digits' })
  pincode: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
