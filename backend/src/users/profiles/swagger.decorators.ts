import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { Profile, ProfileRequest, ProfileUpdate } from './dto/profiles.dto';

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Update own profile' }),
    ApiBody({ type: ProfileUpdate }),
    ApiResponse({
      status: 200,
      description: 'Profile updated successfully',
      schema: {
        example: {
          success: true,
          message: 'Profile updated successfully',
          data: undefined,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation error',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Account suspended or deactivated',
    }),
    ApiResponse({
      status: 404,
      description: 'Profile not found',
    }),
  );
}

export function ApiCompleteProfileSetup() {
  return applyDecorators(
    ApiOperation({ summary: 'Complete profile setup' }),
    ApiBody({ type: ProfileRequest }),
    ApiResponse({
      status: 201,
      description: 'Profile created successfully',
      schema: {
        example: {
          success: true,
          message: 'Profile created successfully',
          data: {
            name: 'Jane Doe',
            birthDate: '1990-01-01',
            phoneNumber: '5512345678',
            gender: 'female',
            fitGoals: ['lose_weight'],
            email: 'user@example.com',
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-01T12:00:00Z',
            age: 34,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation error or Profile already exists',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
  );
}

export function ApiGetProfileByAccountId() {
  return applyDecorators(
    ApiOperation({ summary: 'Get profile by account ID' }),
    ApiParam({ name: 'accountId', type: 'string', example: 'uuid-v4' }),
    ApiResponse({
      status: 200,
      description: 'Profile fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Profile fetched successfully',
          data: {
            name: 'Jane Doe',
            birthDate: '1990-01-01',
            phoneNumber: '5512345678',
            gender: 'female',
            fitGoals: ['lose_weight'],
            email: 'user@example.com',
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-02T12:00:00Z',
            age: 34,
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
  );
}

export function ApiFindMyProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user profile' }),
    ApiResponse({
      status: 200,
      description: 'Profile fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Profile fetched successfully',
          data: {
            name: 'Jane Doe',
            birthDate: '1990-01-01',
            phoneNumber: '5512345678',
            gender: 'female',
            fitGoals: ['lose_weight', 'build_muscle'],
            email: 'user@example.com',
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-02T12:00:00Z',
            age: 34,
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
  );
}
