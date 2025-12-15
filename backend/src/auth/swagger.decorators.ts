import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  TokenResponse,
} from './dto/auth.dto';
import { ProfileRequest } from '../users/profiles/dto/profiles.dto';

export function ApiAuthSignIn() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in with email and password' }),
    ApiBody({ type: LoginRequest }),
    ApiResponse({ status: 200, description: 'Token response', type: TokenResponse }),
  );
}

export function ApiAuthRegisterAccount() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new account' }),
    ApiBody({ type: RegisterAccountRequest }),
    ApiResponse({
      status: 201,
      description: 'Account created',
      schema: {
        example: {
          success: true,
          data: { accountId: 'uuid' },
          message: 'Account was registered, continue with profile setup',
        },
      },
    }),
  );
}

export function ApiAuthVerifyEmail() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify email using token' }),
    ApiBody({ schema: { properties: { token: { type: 'string', example: 'jwt-token' } } } }),
    ApiResponse({ status: 200, description: 'Verification done' }),
  );
}

export function ApiAuthResendVerification() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend email verification link' }),
    ApiBody({ schema: { properties: { email: { type: 'string', format: 'email', example: 'user@example.com' } } } }),
    ApiResponse({ status: 200, description: 'Verification sent' }),
  );
}

export function ApiAuthResendVerificationStatus() {
  return applyDecorators(
    ApiOperation({ summary: 'Get status for resend verification (allowed / wait time)' }),
    ApiBody({ schema: { properties: { email: { type: 'string', format: 'email', example: 'user@example.com' } } } }),
    ApiResponse({
      status: 200,
      description: 'Status payload',
      schema: {
        example: {
          success: true,
          data: { allowed: true, secondsToWait: 0 },
          message: 'Status fetched',
        },
      },
    }),
  );
}

export function ApiAuthCompleteProfileSetup() {
  return applyDecorators(
    ApiOperation({ summary: 'Complete profile setup for an account' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          accountId: { type: 'string', example: 'uuid' },
          profileRequest: { $ref: getSchemaRef(ProfileRequest) },
        },
        required: ['accountId', 'profileRequest'],
      },
    }),
    ApiResponse({ status: 200, description: 'Profile completed' }),
  );
}

export function ApiAuthChangePassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Change account password' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          accountId: { type: 'string', example: 'uuid' },
          changePasswordRequest: { $ref: getSchemaRef(ChangePasswordRequest) },
        },
        required: ['accountId', 'changePasswordRequest'],
      },
    }),
    ApiResponse({ status: 200, description: 'Password changed' }),
  );
}

export function ApiAuthRefreshToken() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh tokens using a refresh token' }),
    ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } }),
    ApiResponse({ status: 200, description: 'New tokens', type: TokenResponse }),
  );
}

export function ApiAuthLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout and clear refresh token' }),
    ApiBody({ schema: { properties: { accountId: { type: 'string', example: 'uuid' } } } }),
    ApiResponse({ status: 200, description: 'Logged out' }),
  );
}

export function ApiAuthGoogleStart() {
  return applyDecorators(
    ApiOperation({ summary: 'Start Google OAuth flow' }),
    ApiResponse({ status: 302, description: 'Redirect to Google' }),
  );
}

export function ApiAuthGoogleCallback() {
  return applyDecorators(
    ApiOperation({ summary: 'Google OAuth callback' }),
    ApiResponse({ status: 302, description: 'Redirect to frontend with tokens' }),
  );
}

// Utility to reference DTOs in schema without circular issues
import { getSchemaPath } from '@nestjs/swagger';
function getSchemaRef(cls: any) {
  return { $ref: getSchemaPath(cls) } as any;
}
