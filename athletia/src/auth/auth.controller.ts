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
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  TokenResponse,
} from './dto/auth.dto';
import { Public } from 'src/auth/guards/decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ApiResponse } from 'src/common/response/api.response';
import { ProfileRequest } from 'src/users/profiles/dto/profiles.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleUser } from './strategies/google.strategy';
import type { Request, Response } from 'express';

type accountIdOnly = { accountId: string };

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // if the result of processing the request is an error,
  // an exception will be thrown and handled by the exception filter
  // otherwise, a successful response will be returned

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: LoginRequest })
  @SwaggerResponse({ status: 200, description: 'Token response', type: TokenResponse })
  @HttpCode(200)
  async signIn(@Body() loginRequest: LoginRequest): Promise<TokenResponse> {
    const tokenResponse = await this.authService.signIn(loginRequest);
    return tokenResponse;
  }

  @Public()
  @Post('register-account')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiBody({ type: RegisterAccountRequest })
  @SwaggerResponse({ status: 201, description: 'Account created', schema: { example: { success: true, data: { accountId: 'uuid' }, message: 'Account was registered, continue with profile setup' } } })
  async registerAccount(
    @Body() registerRequest: RegisterAccountRequest,
  ): Promise<ApiResponse<accountIdOnly>> {
    const result = await this.authService.registerAccount(registerRequest);
    return ApiResponse.success(
      { accountId: result.accountId },
      result.message,
    );
  }

  @Public()
  @HttpCode(200)
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email using token' })
  @ApiBody({ schema: { example: { token: 'jwt-token' } } })
  @SwaggerResponse({ status: 200, description: 'Email verified successfully', schema: { example: { success: true, message: 'account was verified successfully'}}})
  async verifyEmail(@Body('token') token: string): Promise<ApiResponse<void>> {
    const result = await this.authService.verifyEmail(token);
    return ApiResponse.success(undefined, result.message);
  }

  @Public()
  @HttpCode(200)
  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiBody({ schema: { example: { email: 'user@example.com' } } })
  async resendVerification(@Body('email') email: string): Promise<ApiResponse<void>> {
    const result = await this.authService.resendVerification(email);
    return ApiResponse.success(undefined, result.message);
  }

  @Public()
  @HttpCode(200)
  @Post('resend-verification-status')
  @ApiOperation({ summary: 'Get status for resend verification (allowed / wait time)' })
  @ApiBody({ schema: { example: { email: 'user@example.com' } } })
  async resendVerificationStatus(@Body('email') email: string): Promise<ApiResponse<{ allowed: boolean; secondsToWait?: number }>> {
    const status = await this.authService.getResendVerificationStatus(email);
    return ApiResponse.success(status, 'Status fetched');
  }

  @Public()
  @Post('complete-profile-setup')
  @ApiOperation({ summary: 'Complete profile setup for an account' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['accountId','profileRequest'],
      properties: {
        accountId: { type: 'string', format: 'uuid' },
        profileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            birthDate: { type: 'string', format: 'date' },
            phoneNumber: { type: 'string' },
            fitGoals: { type: 'array', items: { type: 'string' } },
            gender: { type: 'string' },
          },
        },
      },
    },
  })
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
  @Patch('change-password')
  @ApiOperation({ summary: 'Change account password' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['accountId','changePasswordRequest'],
      properties: {
        accountId: { type: 'string', format: 'uuid' },
        changePasswordRequest: {
          type: 'object',
          properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string' },
          },
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Refresh tokens using a refresh token' })
  @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string' } }, required: ['refreshToken'] } })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<TokenResponse> {
    const tokenResponse = await this.authService.refreshToken(refreshToken);
    return tokenResponse;
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout and clear refresh token' })
  @ApiBody({ schema: { type: 'object', properties: { accountId: { type: 'string', format: 'uuid' } }, required: ['accountId'] } })
  async logout(
    @Body('accountId') accountId: string,
  ): Promise<ApiResponse<void>> {
    const result = await this.authService.logout(accountId);
    return ApiResponse.success(undefined, result.message);
  }

  // Google OAuth
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Start Google OAuth flow' })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(
    @Req() req: Request & { user: GoogleUser },
    @Res() res: Response,
  ) {
    const tokens = await this.authService.signInWithGoogle(req.user);
    // Redirige al frontend con los tokens en el fragmento del URL
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173/auth/callback';
    const fragment = `#accessToken=${encodeURIComponent(tokens.accessToken)}&refreshToken=${encodeURIComponent(tokens.refreshToken)}`;
    return res.redirect(`${redirectUrl}${fragment}`);
  } 
}
