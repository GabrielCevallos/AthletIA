import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Routine, RoutineRequest, RoutineUpdate } from './dto/routines.dto';

export function ApiCreateRoutine() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Create routine',
      description: 'Create a new routine. Any authenticated user can create routines. Routines created by ADMIN users are automatically marked as official.'
    }),
    ApiBearerAuth(),
    ApiBody({ type: RoutineRequest }),
    ApiResponse({ 
      status: 201, 
      description: 'Routine created successfully. Official flag set to true for ADMIN users.', 
      type: Routine 
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
  );
}

export function ApiListRoutines() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'List routines with pagination',
      description: 'Get a paginated list of all routines. Accessible by all authenticated users.'
    }),
    ApiBearerAuth(),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 }),
    ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip', example: 0 }),
    ApiResponse({
      status: 200,
      description: 'Paginated routine list retrieved successfully',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Routines retrieved successfully' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Routine' } },
              total: { type: 'number', example: 30 },
              limit: { type: 'number', example: 10 },
              offset: { type: 'number', example: 0 },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
  );
}

export function ApiGetRoutine() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Get routine by ID',
      description: 'Retrieve a specific routine by its ID. Accessible by all authenticated users.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Routine UUID' }),
    ApiResponse({
      status: 200,
      description: 'Routine retrieved successfully',
      type: Routine,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 404, description: 'Routine not found' }),
  );
}

export function ApiUpdateRoutine() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Update routine',
      description: 'Update a routine. Only the owner of the routine or users with ADMIN role can update it.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Routine UUID' }),
    ApiBody({ type: RoutineUpdate }),
    ApiResponse({ 
      status: 200, 
      description: 'Routine updated successfully', 
      type: Routine 
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 403, description: 'Forbidden - You can only modify routines that belong to you' }),
    ApiResponse({ status: 404, description: 'Routine not found' }),
  );
}

export function ApiDeleteRoutine() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Delete routine',
      description: 'Delete a routine. Only the owner of the routine or users with ADMIN role can delete it.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Routine UUID' }),
    ApiResponse({ status: 204, description: 'Routine deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 403, description: 'Forbidden - You can only delete routines that belong to you' }),
    ApiResponse({ status: 404, description: 'Routine not found' }),
  );
}
