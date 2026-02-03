import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/users/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailModule } from 'src/common/mail/mail.module';
import { AdminGuard } from './guards/admin.guard';
import { OwnershipGuard } from './guards/ownership.guard';
import { RateLimitService } from 'src/common/guards/rate-limit.service';
import { RateLimitCleanupService } from 'src/common/guards/rate-limit-cleanup.service';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY_ACCESS || 'defaultSecretKey',
    }),
    AccountsModule,
    MailModule,
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    AdminGuard,
    OwnershipGuard,
    RateLimitService,
    RateLimitCleanupService,
  ],
  controllers: [AuthController],
  exports: [AuthService, AdminGuard, OwnershipGuard, RateLimitService],
})
export class AuthModule {}
