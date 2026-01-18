import { IsString, IsIn, IsNotEmpty, ValidateIf, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'Phone number (with country code) or email',
    example: '+919876543210',
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === 'phone')
  @Matches(/^\+[1-9]\d{9,14}$/, {
    message: 'Phone number must be in international format (e.g., +919876543210)',
  })
  @ValidateIf((o) => o.type === 'email')
  @IsEmail({}, { message: 'Invalid email format' })
  target: string;

  @ApiProperty({
    description: 'Type of target (phone or email)',
    enum: ['phone', 'email'],
    example: 'phone',
  })
  @IsIn(['phone', 'email'])
  type: 'phone' | 'email';
}
