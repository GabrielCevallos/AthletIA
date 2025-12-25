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
    ApiOperation({
      summary: 'Sign in with email and password',
      description: 'Authenticate user with email and password credentials. Returns access and refresh tokens upon successful authentication.',
    }),
    ApiBody({
      type: LoginRequest,
      description: 'Login credentials',
      examples: {
        example1: {
          summary: 'Valid login request',
          value: {
            email: 'user@example.com',
            password: 'Str0ngP@ssw0rd',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Authentication successful - Returns access and refresh tokens',
      type: TokenResponse,
      example: {
        success: true,
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          accountId: '123e4567-e89b-12d3-a456-426614174000',
        },
        message: 'Login successful',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials or email not verified',
      schema: {
        example: {
          success: false,
          message: 'Invalid email or password',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid email format or missing fields',
      schema: {
        example: {
          success: false,
          message: 'email must be an email',
        },
      },
    }),
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
    ApiBody({
      schema: {
        properties: { token: { type: 'string', example: 'jwt-token' } },
      },
    }),
    ApiResponse({ status: 200, description: 'Verification done' }),
  );
}

export function ApiAuthResendVerification() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend email verification link' }),
    ApiBody({
      schema: {
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Verification sent' }),
  );
}

export function ApiAuthResendVerificationStatus() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get status for resend verification (allowed / wait time)',
    }),
    ApiBody({
      schema: {
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
        },
      },
    }),
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
          profileRequest: { $ref: getSchemaRef(ProfileRequest) as string },
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
          changePasswordRequest: {
            $ref: getSchemaRef(ChangePasswordRequest) as string,
          },
        },
        required: ['accountId', 'changePasswordRequest'],
      },
    }),
    ApiResponse({ status: 200, description: 'Password changed' }),
  );
}

export function ApiAuthRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh tokens using a refresh token',
      description: 'Generate new access and refresh tokens using a valid refresh token. Useful when the access token has expired.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Valid refresh token',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
        required: ['refreshToken'],
      },
      description: 'Refresh token request',
    }),
    ApiResponse({
      status: 200,
      description: 'New tokens generated successfully',
      type: TokenResponse,
      example: {
        success: true,
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          accountId: '123e4567-e89b-12d3-a456-426614174000',
        },
        message: 'Token refreshed',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid, expired, or revoked refresh token',
      schema: {
        example: {
          success: false,
          message: 'Invalid refresh token',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Missing refresh token',
      schema: {
        example: {
          success: false,
          message: 'refreshToken is required',
        },
      },
    }),
  );
}

export function ApiAuthLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout and clear refresh token' }),
    ApiBody({
      schema: {
        properties: { accountId: { type: 'string', example: 'uuid' } },
      },
    }),
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
    ApiResponse({
      status: 302,
      description: 'Redirect to frontend with tokens',
    }),
  );
}

// Utility to reference DTOs in schema without circular issues
import { getSchemaPath } from '@nestjs/swagger';
function getSchemaRef(cls: any) {
  return { $ref: getSchemaPath(cls) } as any;
}
