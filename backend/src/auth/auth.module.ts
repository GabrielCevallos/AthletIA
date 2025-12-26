import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/users/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailService } from 'src/common/mail/mail.service';
import { AdminGuard } from './guards/admin.guard';
import { OwnershipGuard } from './guards/ownership.guard';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY_ACCESS || 'defaultSecretKey',
    }),
    AccountsModule,
  ],
  providers: [AuthService, GoogleStrategy, MailService, AdminGuard, OwnershipGuard],
  controllers: [AuthController],
  exports: [AuthService, AdminGuard, OwnershipGuard],
})
export class AuthModule {}
