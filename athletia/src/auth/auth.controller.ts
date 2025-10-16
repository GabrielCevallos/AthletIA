import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  TokenResponse,
} from './dto/auth.dto';
import { Public } from 'src/auth/guards/decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ApiResponse } from 'src/common/interfaces/api-response';
import { ProfileRequest } from 'src/profiles/dto/profiles.dto';
// import { GoogleAuthGuard } from './guards/google-auth.guard';
// import type { Request, Response } from 'express';

type accountIdOnly = { accountId: string };
type systemStatusOnly = { status: string };

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // if the result of processing the request is an error,
  // an exception will be thrown and handled by the exception filter
  // otherwise, a successful response will be returned

  @Public()
  @Post('login')
  @HttpCode(200)
  async signIn(@Body() loginRequest: LoginRequest): Promise<TokenResponse> {
    const tokenResponse = await this.authService.signIn(loginRequest);
    return tokenResponse;
  }

  @Public()
  @Post('register-account')
  async registerAccount(
    @Body() registerRequest: RegisterAccountRequest,
  ): Promise<ApiResponse<accountIdOnly>> {
    const accountSaved =
      await this.authService.registerAccount(registerRequest);
    return ApiResponse.success(
      { accountId: accountSaved.accountId },
      accountSaved.message,
    );
  }

  @Public()
  @Post('complete-profile-setup')
  async completeWithProfileSetup(
    @Body('accountId') accountId: string,
    @Body('profileRequest') profileRequest: ProfileRequest,
  ): Promise<ApiResponse<void>> {
    const result = await this.authService.completeWithProfileSetup(
      accountId,
      profileRequest,
    );
    return ApiResponse.success(undefined, result.message);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Body('accountId') accountId: string,
    @Body('changePasswordRequest') changePasswordRequest: ChangePasswordRequest,
  ): Promise<ApiResponse<void>> {
    const result = await this.authService.changePassword(
      accountId,
      changePasswordRequest,
    );
    return ApiResponse.success(undefined, result.message);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<TokenResponse> {
    const tokenResponse = await this.authService.refreshToken(refreshToken);
    return tokenResponse;
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  async logout(
    @Body('accountId') accountId: string,
  ): Promise<ApiResponse<void>> {
    const result = await this.authService.logout(accountId);
    return ApiResponse.success(undefined, result.message);
  }

  @Public()
  @Post('health-check')
  @HttpCode(200)
  healthCheck(): systemStatusOnly {
    return { status: 'OK' };
  }

  // Google OAuth
  /* @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    // After successful auth, Passport puts user on req.user
    const tokens = await this.authService.signInWithGoogle(req.user as any);
    // Option A: return JSON if used by SPA popup
    if ((req.query as any).json === 'true') {
      return res.json(tokens);
    }
    // Option B: redirect with tokens as fragment (avoid query logging)
    const redirectUrl = process.env.GOOGLE_SUCCESS_REDIRECT ||
      'http://localhost:3000/auth/success';
    const fragment = `#accessToken=${encodeURIComponent(tokens.accessToken)}&refreshToken=${encodeURIComponent(tokens.refreshToken)}`;
    return res.redirect(`${redirectUrl}${fragment}`);
  } */
}
