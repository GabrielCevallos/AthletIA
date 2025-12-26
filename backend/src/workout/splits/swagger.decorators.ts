import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Split, SplitRequest, SplitUpdate } from './dto/splits.dto';

export function ApiCreateSplit() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Create split',
      description: 'Create a new split. Any authenticated user can create splits. Official flag is automatically set to false.'
    }),
    ApiBearerAuth(),
    ApiBody({ type: SplitRequest }),
    ApiResponse({ 
      status: 201, 
      description: 'Split created successfully', 
      type: Split 
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
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
              items: { type: 'array', items: { $ref: '#/components/schemas/Split' } },
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
      description: 'Retrieve a specific split by its ID. Accessible by all authenticated users.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Split UUID' }),
    ApiResponse({ 
      status: 200, 
      description: 'Split retrieved successfully', 
      type: Split 
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 404, description: 'Split not found' }),
  );
}

export function ApiUpdateSplit() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Update split',
      description: 'Update a split. Only the owner of the split or users with ADMIN role can update it.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Split UUID' }),
    ApiBody({ type: SplitUpdate }),
    ApiResponse({ 
      status: 200, 
      description: 'Split updated successfully', 
      type: Split 
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 403, description: 'Forbidden - You can only modify splits that belong to you' }),
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
