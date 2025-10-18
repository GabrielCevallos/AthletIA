import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/users/accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY_ACCESS || 'defaultSecretKey',
    }),
    AccountsModule,
  ],
  providers: [
    AuthService,
    GoogleStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
