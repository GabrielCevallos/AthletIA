import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  TokenResponse,
} from './dto/auth.dto';
import { Public } from 'src/auth/guards/decorators/public.decorator';
import { ProfileRequest } from 'src/persons/dto/persons.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async signIn(
    @Body() loginRequest: LoginRequest,
  ): Promise<TokenResponse | { message: string; accountId: string }> {
    return this.authService.signIn(loginRequest);
  }

  @Public()
  @Post('register-account')
  async registerAccount(
    @Body() registerRequest: RegisterAccountRequest,
  ): Promise<{ message: string; accountId: string } | { message: string }> {
    return this.authService.registerAccount(registerRequest);
  }

  @Public()
  @Post('complete-profile-setup')
  async completeWithProfileSetup(
    @Body('accountId') accountId: string,
    @Body('profileRequest') profileRequest: ProfileRequest,
  ): Promise<{ message: string }> {
    return await this.authService.completeWithProfileSetup(
      accountId,
      profileRequest,
    );
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Body('accountId') accountId: string,
    @Body('changePasswordRequest') changePasswordRequest: ChangePasswordRequest,
  ): Promise<{ message: string }> {
    return await this.authService.changePassword(
      accountId,
      changePasswordRequest,
    );
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<TokenResponse> {
    return await this.authService.refreshToken(refreshToken);
  }

  @Public()
  @Post('health-check')
  @HttpCode(200)
  healthCheck(): { status: string } {
    return { status: 'OK' };
  }
}
