import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Exercise, ExerciseRequest, ExerciseUpdate } from './dto/exercises.dto';

export function ApiCreateExercise() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Create exercise',
      description: 'Create a new exercise. Only accessible by users with ADMIN role.'
    }),
    ApiBearerAuth(),
    ApiBody({ type: ExerciseRequest }),
    ApiResponse({
      status: 201,
      description: 'Exercise created successfully',
      type: Exercise,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 403, description: 'Forbidden - Only administrators can create exercises' }),
  );
}

export function ApiListExercises() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'List exercises with pagination',
      description: 'Get a paginated list of all exercises. Accessible by all authenticated users.'
    }),
    ApiBearerAuth(),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 }),
    ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip', example: 0 }),
    ApiResponse({
      status: 200,
      description: 'Paginated exercise list retrieved successfully',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Exercises retrieved successfully' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Exercise' } },
              total: { type: 'number', example: 50 },
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

export function ApiGetExercise() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Get exercise by ID',
      description: 'Retrieve a specific exercise by its ID. Accessible by all authenticated users.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Exercise UUID' }),
    ApiResponse({
      status: 200,
      description: 'Exercise retrieved successfully',
      type: Exercise,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}

export function ApiUpdateExercise() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Update exercise',
      description: 'Update an existing exercise. Only accessible by users with ADMIN role.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Exercise UUID' }),
    ApiBody({ type: ExerciseUpdate }),
    ApiResponse({
      status: 200,
      description: 'Exercise updated successfully',
      type: Exercise,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 403, description: 'Forbidden - Only administrators can update exercises' }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}

export function ApiDeleteExercise() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Delete exercise',
      description: 'Delete an exercise. Only accessible by users with ADMIN role.'
    }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Exercise UUID' }),
    ApiResponse({ status: 204, description: 'Exercise deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized - No valid authentication token' }),
    ApiResponse({ status: 403, description: 'Forbidden - Only administrators can delete exercises' }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}
