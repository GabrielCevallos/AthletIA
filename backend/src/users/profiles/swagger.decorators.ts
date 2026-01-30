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
      description: 'Profile updated',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Profile updated successfully' },
          data: { type: 'null' },
        },
      },
    }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
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
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              message: {
                type: 'string',
                example: 'Profile created successfully',
              },
              data: { $ref: getSchemaPath(Profile) },
            },
          },
        ],
      },
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
  );
}

export function ApiGetProfileByAccountId() {
  return applyDecorators(
    ApiOperation({ summary: 'Get profile by account ID' }),
    ApiParam({ name: 'accountId', type: 'string' }),
    ApiResponse({
      status: 200,
      description: 'Profile fetched successfully',
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              message: {
                type: 'string',
                example: 'Profile fetched successfully',
              },
              data: { $ref: getSchemaPath(Profile) },
            },
          },
        ],
      },
    }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
  );
}

export function ApiFindMyProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user profile' }),
    ApiResponse({
      status: 200,
      description: 'Profile fetched successfully',
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              message: {
                type: 'string',
                example: 'Profile fetched successfully',
              },
              data: { $ref: getSchemaPath(Profile) },
            },
          },
        ],
      },
    }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
  );
}
