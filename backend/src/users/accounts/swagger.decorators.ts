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
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'search', required: false, type: String }),
    ApiResponse({
      status: 200,
      description: 'Users retrieved',
      type: UserItem,
      isArray: true,
    }),
  );
}

export function ApiFindUserById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({ status: 200, description: 'User found', type: User }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiSuspendUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Suspend user by ID' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({ status: 200, description: 'User suspended' }),
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
    ApiResponse({ status: 200, description: 'Role assigned' }),
    ApiResponse({ status: 400, description: 'Invalid operation' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiRequestModeratorRole() { 
    return applyDecorators(
      ApiOperation({ summary: 'Request moderator role' }),
      ApiResponse({ status: 200, description: 'Moderator role request submitted' }),
      ApiResponse({ status: 404, description: 'User not found' }),
    );
}
