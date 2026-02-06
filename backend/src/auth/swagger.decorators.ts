import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterAccountRequest,
  ResetPasswordRequest,
  TokenResponse,
} from './dto/auth.dto';
import { ProfileRequest } from '../users/profiles/dto/profiles.dto';
import { User } from '../users/accounts/dto/user-response.dtos';

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
          message: messages.verificationEmailSent,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation error or account already exists',
      schema: {
        example: {
          message: [
            'email must be an email',
            'password must be longer than or equal to 8 characters',
            'password must contain uppercase, lowercase, number and special character',
            'Email already registered',
          ],
          error: 'Bad Request',
          statusCode: 400,
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
    ApiResponse({
      status: 200,
      description: 'Email verified successfully',
      schema: {
        example: {
          success: true,
          data: undefined,
          message: 'Email verified successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid or expired token',
      schema: {
        example: {
          success: false,
          message: 'Invalid or expired token',
        },
      },
    }),
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
    ApiResponse({
      status: 200,
      description: 'Verification email sent',
      schema: {
        example: {
          success: true,
          data: undefined,
          message: 'Verification email sent',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Too many requests or invalid email',
      schema: {
        example: {
          message: [
            'email must be an email',
            'Too many verification requests',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
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
          profileRequest: { $ref: getSchemaPath(ProfileRequest) },
        },
        required: ['accountId', 'profileRequest'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Profile completed',
    }),
  );
}

export function ApiAuthForgotPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Request password reset' }),
    ApiBody({ type: ForgotPasswordRequest }),
    ApiResponse({
      status: 200,
      description: 'Password reset email sent (if email exists)',
      schema: {
        example: {
          success: true,
          message:
            'If the email exists in our system, you will receive a link to reset your password.',
        },
      },
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests',
    }),
  );
}

export function ApiAuthResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset password using token' }),
    ApiBody({ type: ResetPasswordRequest }),
    ApiResponse({
      status: 200,
      description: 'Password reset successfully',
      schema: {
        example: {
          success: true,
          message:
            'Password reset successfully. You can now log in with your new password.',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid token or password requirements not met',
      schema: {
        example: {
          success: false,
          message: 'The recovery link is invalid or has expired.',
        },
      },
    }),
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
            $ref: getSchemaPath(ChangePasswordRequest),
          },
        },
        required: ['accountId', 'changePasswordRequest'],
      },
    }),
    ApiResponse({ status: 200, description: 'Password changed' }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid password or validation error',
      schema: {
        example: {
          message: [
            'currentPassword must be a string',
            'newPassword must be longer than or equal to 8 characters',
            'newPassword must contain uppercase, lowercase, number and special character',
            'Current password is incorrect',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid account',
    }),
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
    ApiResponse({
      status: 200,
      description: 'Logged out successfully',
      schema: {
        example: {
          success: true,
          data: undefined,
          message: 'Logged out successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid Account ID',
      schema: {
        example: {
          success: false,
          message: 'Invalid account ID',
        },
      },
    }),
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

export function ApiAuthMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get authenticated user' }),
    ApiResponse({
      status: 200,
      description: 'Authenticated user returned',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: { $ref: getSchemaPath(User) },
          message: { type: 'string' },
        },
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            status: 'ACTIVE',
            role: 'USER',
            hasProfile: true,
            name: 'Jane Doe',
            birthDate: null,
          },
          message: 'Authenticated user fetched',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          message: 'Unauthorized',
        },
      },
    }),
  );
}

export function ApiAuthGoogleMobileLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Google Mobile Login',
      description:
        'Authenticate user using a Google Access Token obtained from a mobile device.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'ya29.a0AfH6SM...' },
        },
      },
      description: 'Google Access Token',
    }),
    ApiResponse({
      status: 200,
      description: 'Authentication successful',
      type: TokenResponse,
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid Google Token',
    }),
  );
}

// Utility to reference DTOs in schema without circular issues
import { getSchemaPath } from '@nestjs/swagger';
import { messages } from './constants';
function getSchemaRef(cls: any) {
  return { $ref: getSchemaPath(cls) } as any;
}
