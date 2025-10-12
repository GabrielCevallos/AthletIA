import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/accounts/accounts.module';
import { jwtConstants } from './constants';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: jwtConstants.accessExpiration },
    }),
    AccountsModule,
  ],
  providers: [
    AuthService,
    /* {
      provide: APP_GUARD,
      useClass: AuthGuard
    }, */
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
