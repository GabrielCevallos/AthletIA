import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { getSchemaPath } from '@nestjs/swagger';
import { Split, SplitRequest, SplitUpdate } from './dto/splits.dto';

export function ApiCreateSplit() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create split',
      description:
        'Create a new split. Any authenticated user can create splits. Official flag is automatically set to false.',
    }),
    ApiBearerAuth(),
    ApiBody({ type: SplitRequest }),
    ApiResponse({
      status: 201,
      description: 'Split created successfully',
      schema: {
        example: {
          success: true,
          message: 'Split created successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Upper/Lower',
            description: '4-day weekly program split into upper and lower.',
            routineIds: ['123e4567-e89b-12d3-a456-426614174001'],
            trainingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            official: false,
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-01T12:00:00Z',
            routines: [],
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation error. Invalid or missing required fields',
      schema: {
        example: {
          message: [
            'name must be longer than or equal to 3 characters',
            'description must be longer than or equal to 10 characters',
            'trainingDays must contain at least 1 elements',
            'routineIds must contain at least 1 elements',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
  );
}

export function ApiListSplits() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'List splits with pagination',
      description: 'Get a paginated list of all splits. Accessible by all authenticated users.'
    }),
    ApiBearerAuth(),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 }),
    ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip', example: 0 }),
    ApiResponse({
      status: 200,
      description: 'Paginated split list retrieved successfully',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Splits retrieved successfully' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: getSchemaPath(Split) } },
              total: { type: 'number', example: 20 },
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

export function ApiGetSplit() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get split by ID',
      description:
        'Retrieve a specific split by its ID. Accessible by all authenticated users.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'Split UUID',
    }),
    ApiResponse({
      status: 200,
      description: 'Split retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Split retrieved successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Upper/Lower',
            description: '4-day weekly program split into upper and lower.',
            trainingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            official: false,
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-01T12:00:00Z',
            routines: [
              {
                id: '123e4567-e89b-12d3-a456-426614174001',
                name: 'Upper Body A',
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
    ApiResponse({ status: 404, description: 'Split not found' }),
  );
}

export function ApiUpdateSplit() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update split',
      description:
        'Update a split. Only the owner of the split or users with ADMIN role can update it.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'Split UUID',
    }),
    ApiBody({ type: SplitUpdate }),
    ApiResponse({
      status: 200,
      description: 'Split updated successfully',
      schema: {
        example: {
          success: true,
          message: 'Split updated successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Upper/Lower',
            description: '4-day weekly program split into upper and lower.',
            trainingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            official: false,
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-01T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation error. Invalid field values',
      schema: {
        example: {
          message: [
            'name must be longer than or equal to 3 characters',
            'trainingDays must contain at least 1 elements',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden - You can only modify splits that belong to you',
    }),
    ApiResponse({ status: 404, description: 'Split not found' }),
  );
}

export function ApiDeleteSplit() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Delete split',
      description: 'Delete a split. Only the owner of the split or users with ADMIN role can delete it.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Split UUID' }),
    ApiResponse({ status: 204, description: 'Split deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 403, description: 'Forbidden - You can only delete splits that belong to you' }),
    ApiResponse({ status: 404, description: 'Split not found' }),
  );
}
