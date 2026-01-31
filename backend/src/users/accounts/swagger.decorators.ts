import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { User, UserItem } from '../../users/accounts/dto/user-response.dtos';
import { Role } from '../../users/accounts/enum/role.enum';

export function ApiFindAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'List users with pagination' }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page',
      example: 10,
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Pagination offset',
      example: 0,
    }),
    ApiResponse({
      status: 200,
      description: 'Users retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'User list fetched successfully',
          items: [
            {
              email: 'user@example.com',
              id: '123e4567-e89b-12d3-a456-426614174000',
              state: 'ACTIVE',
              role: 'user',
              hasProfile: true,
              name: 'Jane Doe',
              birthDate: '1990-01-01',
            },
          ],
          total: 100,
          limit: 10,
          offset: 0,
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}

export function ApiFindUserById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'User details fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'User fetched successfully',
          data: {
            email: 'user@example.com',
            id: '123e4567-e89b-12d3-a456-426614174000',
            state: 'ACTIVE',
            role: 'user',
            hasProfile: true,
            name: 'Jane Doe',
            birthDate: '1990-01-01',
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiSuspendUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Suspend user by ID' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'User suspended successfully',
      schema: {
        example: {
          success: true,
          message: 'Account suspended/activated successfully',
          data: undefined,
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Admin/Moderator only',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiGiveRole() {
  return applyDecorators(
    ApiOperation({ summary: 'Assign role to user' }),
    ApiParam({ name: 'id', type: String }),
    ApiBody({
      schema: {
        properties: { role: { type: 'string', enum: Object.values(Role) } },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Role assigned successfully',
      schema: {
        example: {
          success: true,
          message: 'Role updated successfully',
          data: undefined,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid operation (e.g. changing own role)',
      schema: {
        example: {
          success: false,
          message: 'You cannot change your own role',
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin only' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiRequestModeratorRole() {
  return applyDecorators(
    ApiOperation({ summary: 'Request moderator role' }),
    ApiResponse({
      status: 200,
      description: 'Moderator role request submitted successfully',
      schema: {
        example: {
          success: true,
          message: 'Moderator role requested successfully',
          data: undefined,
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}
