import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { target, type } = dto;

    // Generate OTP
    const otpLength = this.configService.get('otp.length', 6);
    const otp = this.generateOtp(otpLength);
    const expiryMinutes = this.configService.get('otp.expiryMinutes', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Delete any existing OTP for this target
    await this.prisma.otpVerification.deleteMany({
      where: { target },
    });

    // Create new OTP record
    await this.prisma.otpVerification.create({
      data: {
        target,
        otp,
        expiresAt,
      },
    });

    // Send OTP via SMS or Email
    if (type === 'phone') {
      await this.sendSmsOtp(target, otp);
    } else {
      await this.sendEmailOtp(target, otp);
    }

    return {
      message: 'OTP sent successfully',
      expiresIn: expiryMinutes * 60,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { target, otp } = dto;

    // Find OTP record
    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        target,
        otp,
        verified: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      // Increment attempts
      await this.prisma.otpVerification.updateMany({
        where: { target, verified: false },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Check max attempts
    if (otpRecord.attempts >= 5) {
      throw new BadRequestException('Maximum OTP attempts exceeded. Please request a new OTP.');
    }

    // Mark as verified
    await this.prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Find or create user
    const isPhone = target.startsWith('+');
    let user = await this.prisma.user.findFirst({
      where: isPhone ? { phone: target } : { email: target },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: isPhone
          ? { phone: target, isVerified: true }
          : { email: target, isVerified: true },
      });
    } else {
      // Update verification status
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, lastLoginAt: new Date() },
      });
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user.id);

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private generateOtp(length: number): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, type: 'access' },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      },
    );
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      },
    );
  }

  private async sendSmsOtp(phone: string, otp: string): Promise<void> {
    // TODO: Integrate with MSG91 or Twilio
    console.log(`[DEV] SMS OTP to ${phone}: ${otp}`);
  }

  private async sendEmailOtp(email: string, otp: string): Promise<void> {
    // TODO: Integrate with SendGrid or AWS SES
    console.log(`[DEV] Email OTP to ${email}: ${otp}`);
  }
}
