import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Phone number (with country code) or email',
    example: '+919876543210',
  })
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty({
    description: 'OTP code received',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 8)
  otp: string;
}
