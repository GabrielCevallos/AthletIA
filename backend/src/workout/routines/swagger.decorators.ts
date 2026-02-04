import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Routine, RoutineRequest, RoutineUpdate } from './dto/routines.dto';

export function ApiCreateRoutine() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create routine',
      description:
        'Create a new routine. Any authenticated user can create routines. Routines created by ADMIN users are automatically marked as official.',
    }),
    ApiBearerAuth(),
    ApiBody({ type: RoutineRequest }),
    ApiResponse({
      status: 201,
      description: 'Routine created successfully.',
      schema: {
        example: {
          success: true,
          message: 'Routine created successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Upper/Lower Hypertrophy',
            description: '4-day program focused on strength and hypertrophy.',
            exerciseIds: ['123e4567-e89b-12d3-a456-426614174001'],
            routineGoal: ['muscle_gain'],
            official: false,
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-01T12:00:00Z',
            nExercises: 1,
            userId: '123e4567-e89b-12d3-a456-426614174099',
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
            'exerciseIds must contain at least 1 elements',
            'routineGoal must contain at least 1 elements',
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

export function ApiListRoutines() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'List routines with pagination',
      description: 'Get a paginated list of all routines. Accessible by all authenticated users. This action updates the user daily streak.'
    }),
    ApiBearerAuth(),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 }),
    ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip', example: 0 }),
    ApiResponse({
      status: 200,
      description: 'Paginated routine list retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Routines retrieved successfully',
          data: {
            items: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Upper/Lower Hypertrophy',
                description: '4-day program focused on strength and hypertrophy.',
                routineGoal: ['muscle_gain'],
                official: false,
                exercises: [
                  {
                    id: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Barbell Bench Press',
                    description: 'Composite exercise for chest development.',
                  },
                ],
                nExercises: 1,
                createdAt: '2024-01-01T12:00:00Z',
                updatedAt: '2024-01-01T12:00:00Z',
              },
            ],
            total: 30,
            limit: 10,
            offset: 0,
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
      description:
        'Retrieve a specific routine by its ID. Accessible by all authenticated users.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'Routine UUID',
    }),
    ApiResponse({
      status: 200,
      description: 'Routine retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Routine retrieved successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Upper/Lower Hypertrophy',
            description: 'Description...',
            routineGoal: ['muscle_gain'],
            official: false,
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-01T12:00:00Z',
            nExercises: 5,
            exercises: [
              {
                id: '123e4567-e89b-12d3-a456-426614174001',
                name: 'Bench Press',
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
    ApiResponse({ status: 404, description: 'Routine not found' }),
  );
}

export function ApiUpdateRoutine() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update routine',
      description:
        'Update a routine. Only the owner of the routine or users with ADMIN role can update it.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'Routine UUID',
    }),
    ApiBody({ type: RoutineUpdate }),
    ApiResponse({
      status: 200,
      description: 'Routine updated successfully',
      schema: {
        example: {
          success: true,
          message: 'Routine updated successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Upper/Lower Hypertrophy',
            description: 'Updated description...',
            routineGoal: ['muscle_gain'],
            official: false,
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-02T12:00:00Z',
            nExercises: 5,
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
            'exerciseIds must contain at least 1 elements',
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
        'Forbidden - You can only modify routines that belong to you',
    }),
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
