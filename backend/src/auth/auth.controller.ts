import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  TokenResponse,
} from './dto/auth.dto';
import { Public } from 'src/auth/guards/decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ResponseBody } from 'src/common/response/api.response';
import { ProfileRequest } from 'src/users/profiles/dto/profiles.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleUser } from './strategies/google.strategy';
import type { Request, Response } from 'express';
import {
  ApiAuthSignIn,
  ApiAuthRegisterAccount,
  ApiAuthVerifyEmail,
  ApiAuthResendVerification,
  ApiAuthResendVerificationStatus,
  ApiAuthCompleteProfileSetup,
  ApiAuthChangePassword,
  ApiAuthRefreshToken,
  ApiAuthLogout,
  ApiAuthGoogleStart,
  ApiAuthGoogleCallback,
} from './swagger.decorators';

type accountIdOnly = { accountId: string };

@Controller('auth')
@ApiTags('auth')
@ApiExtraModels(ProfileRequest, ChangePasswordRequest)
export class AuthController {
  constructor(private authService: AuthService) {}

  // if the result of processing the request is an error,
  // an exception will be thrown and handled by the exception filter
  // otherwise, a successful response will be returned

  @Public()
  @Post('login')
  @ApiAuthSignIn()
  @HttpCode(200)
  async signIn(@Body() loginRequest: LoginRequest): Promise<ResponseBody<TokenResponse>> {
    const tokenResponse = await this.authService.signIn(loginRequest);
    return ResponseBody.success(tokenResponse, 'Login successful');
  }

  @Public()
  @Post('register-account')
  @ApiAuthRegisterAccount()
  @HttpCode(201)
  async registerAccount(
    @Body() registerRequest: RegisterAccountRequest,
  ): Promise<ResponseBody<accountIdOnly>> {
    const result = await this.authService.registerAccount(registerRequest);
    return ResponseBody.success(
      { accountId: result.accountId },
      result.message,
    );
  }

  @Public()
  @Post('verify-email')
  @ApiAuthVerifyEmail()
  async verifyEmail(@Body('token') token: string): Promise<ResponseBody<void>> {
    const result = await this.authService.verifyEmail(token);
    return ResponseBody.success(undefined, result.message);
  }

  @Public()
  @Post('resend-verification')
  @ApiAuthResendVerification()
  async resendVerification(
    @Body('email') email: string,
  ): Promise<ResponseBody<void>> {
    const result = await this.authService.resendVerification(email);
    return ResponseBody.success(undefined, result.message);
  }

  @Public()
  @Post('resend-verification-status')
  @ApiAuthResendVerificationStatus()
  async resendVerificationStatus(
    @Body('email') email: string,
  ): Promise<ResponseBody<{ allowed: boolean; secondsToWait?: number }>> {
    const status = await this.authService.getResendVerificationStatus(email);
    return ResponseBody.success(status, 'Status fetched');
  }

  @Public()
  @Post('complete-profile-setup')
  @ApiAuthCompleteProfileSetup()
  @HttpCode(200)
  async completeWithProfileSetup(
    @Body('accountId') accountId: string,
    @Body('profileRequest') profileRequest: ProfileRequest,
  ): Promise<ResponseBody<void>> {
    const result = await this.authService.completeWithProfileSetup(
      accountId,
      profileRequest,
    );
    return ResponseBody.success(undefined, result.message);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  @ApiAuthChangePassword()
  async changePassword(
    @Body('accountId') accountId: string,
    @Body('changePasswordRequest') changePasswordRequest: ChangePasswordRequest,
  ): Promise<ResponseBody<void>> {
    const result = await this.authService.changePassword(
      accountId,
      changePasswordRequest,
    );
    return ResponseBody.success(undefined, result.message);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  @ApiAuthRefreshToken()
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ResponseBody<TokenResponse>> {
    const tokenResponse = await this.authService.refreshToken(refreshToken);
    return ResponseBody.success(tokenResponse, 'Token refreshed');
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  @ApiAuthLogout()
  async logout(
    @Body('accountId') accountId: string,
  ): Promise<ResponseBody<void>> {
    const result = await this.authService.logout(accountId);
    return ResponseBody.success(undefined, result.message);
  }

  // Google OAuth
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiAuthGoogleStart()
  async googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiAuthGoogleCallback()
  async googleCallback(
    @Req() req: Request & { user: GoogleUser },
    @Res() res: Response,
  ) {
    const tokens = await this.authService.signInWithGoogle(req.user);
    // Redirige al frontend con los tokens en el fragmento del URL
    const redirectUrl =
      process.env.FRONTEND_URL || 'http://localhost:5173/auth/callback';
    const fragment = `#accessToken=${encodeURIComponent(tokens.accessToken)}&refreshToken=${encodeURIComponent(tokens.refreshToken)}`;
    return res.redirect(`${redirectUrl}${fragment}`);
  }
}
