import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
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
  ApiAuthChangePassword,
  ApiAuthRefreshToken,
  ApiAuthLogout,
  ApiAuthGoogleStart,
  ApiAuthGoogleCallback,
  ApiAuthMe,
  ApiAuthGoogleMobileLogin,
} from './swagger.decorators';
import { User } from 'src/users/accounts/dto/user-response.dtos';
//import { log } from 'console';

type accountIdOnly = { accountId: string };

@Controller('auth')
@ApiTags('auth')
@ApiExtraModels(ProfileRequest, ChangePasswordRequest, User)
export class AuthController {
  constructor(private authService: AuthService) {}

  // if the result of processing the request is an error,
  // an exception will be thrown and handled by the exception filter
  // otherwise, a successful response will be returned

  @Public()
  @Post('login')
  @ApiAuthSignIn()
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginRequest: LoginRequest): Promise<ResponseBody<TokenResponse>> {
    const tokenResponse = await this.authService.signIn(loginRequest);
    return ResponseBody.success(tokenResponse, 'Login successful');
  }

  @Public()
  @Post('register-account')
  @ApiAuthRegisterAccount()
  @HttpCode(HttpStatus.CREATED)
  async registerAccount(
    @Body() registerRequest: RegisterAccountRequest,
  ): Promise<ResponseBody<undefined>> {
    const result = await this.authService.registerAccount(registerRequest);
    return ResponseBody.success(
      undefined,
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
  @HttpCode(HttpStatus.OK)
  @ApiAuthRefreshToken()
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ResponseBody<TokenResponse>> {
    const tokenResponse = await this.authService.refreshToken(refreshToken);
    return ResponseBody.success(tokenResponse, 'Token refreshed');
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiAuthLogout()
  async logout(
    @Body('accountId') accountId: string,
  ): Promise<ResponseBody<void>> {
    const result = await this.authService.logout(accountId);
    return ResponseBody.success(undefined, result.message);
  }

  @Public()
  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  @ApiAuthGoogleMobileLogin()
  async googleMobileLogin(
    @Body('token') googleAccessToken: string,
  ): Promise<ResponseBody<TokenResponse>> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: { Authorization: `Bearer ${googleAccessToken}` },
        },
      );

      if (!response.ok) {
        throw new UnauthorizedException('Token inválido de Google');
      }

      const googleUserResponse = await response.json();

      const googleUser: GoogleUser = {
        provider: 'google',
        sub: googleUserResponse.sub,
        email: googleUserResponse.email,
        name: googleUserResponse.name,
        picture: googleUserResponse.picture,
      };

      const tokenResponse = await this.authService.signInWithGoogle(googleUser);
      return ResponseBody.success(tokenResponse, 'Login successful');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error autenticando con Google');
    }
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

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiAuthMe()
  async me(@Req() req: Request): Promise<ResponseBody<User>> {
    const user = await this.authService.getCurrentUser(req.user);
    //log("Authenticated user: ", user);
    return ResponseBody.success(user, 'Authenticated user fetched');
  }
}
