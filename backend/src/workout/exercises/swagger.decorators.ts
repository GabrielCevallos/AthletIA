import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Exercise, ExerciseRequest, ExerciseUpdate } from './dto/exercises.dto';

export function ApiCreateExercise() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create exercise',
      description:
        'Create a new exercise. Only accessible by users with ADMIN role.',
    }),
    ApiBearerAuth(),
    ApiBody({ type: ExerciseRequest }),
    ApiResponse({
      status: 201,
      description: 'Exercise created successfully',
      schema: {
        example: {
          success: true,
          message: 'Exercise created successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Barbell Bench Press',
            description: 'Composite exercise for chest development.',
            equipment: 'barbell',
            parentExerciseId: null,
            video: 'https://example.com/bench-press',
            minSets: 3,
            maxSets: 5,
            minReps: 8,
            maxReps: 12,
            minRestTime: 90,
            maxRestTime: 180,
            muscleTarget: ['chest', 'triceps', 'deltoids'],
            exerciseType: ['strength', 'bodybuilding'],
            instructions: ['Lie on bench', 'Lower bar to chest', 'Press up'],
            benefit: {
              title: 'Builds upper body strength',
              description: 'Focuses on pectorals and triceps',
              categories: ['Strength'],
            },
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Only administrators can create exercises',
    }),
  );
}

export function ApiListExercises() {
  return applyDecorators(
    ApiOperation({
      summary: 'List exercises with pagination',
      description:
        'Get a paginated list of all exercises. Accessible by all authenticated users.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page',
      example: 10,
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Number of items to skip',
      example: 0,
    }),
    ApiResponse({
      status: 200,
      description: 'Paginated exercise list retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Exercises retrieved successfully',
          data: {
            items: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Barbell Bench Press',
                description: 'Composite exercise for chest development.',
                equipment: 'barbell',
                muscleTarget: ['chest', 'triceps'],
                exerciseType: ['strength'],
                video: 'https://example.com/video',
              },
            ],
            total: 50,
            limit: 10,
            offset: 0,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
  );
}

export function ApiGetExercise() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get exercise by ID',
      description:
        'Retrieve a specific exercise by its ID. Accessible by all authenticated users.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'Exercise UUID',
    }),
    ApiResponse({
      status: 200,
      description: 'Exercise retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Exercise retrieved successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Barbell Bench Press',
            description: 'Composite exercise for chest development.',
            equipment: 'barbell',
            video: 'https://example.com/bench-press',
            muscleTarget: ['chest', 'triceps'],
            exerciseType: ['strength'],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}

export function ApiUpdateExercise() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update exercise',
      description:
        'Update an existing exercise. Only accessible by users with ADMIN role.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'Exercise UUID',
    }),
    ApiBody({ type: ExerciseUpdate }),
    ApiResponse({
      status: 200,
      description: 'Exercise updated successfully',
      schema: {
        example: {
          success: true,
          message: 'Exercise updated successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Barbell Bench Press',
            updatedAt: '2024-01-02T10:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Only administrators can update exercises',
    }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}

export function ApiDeleteExercise() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete exercise',
      description: 'Delete an exercise. Only accessible by users with ADMIN role.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'Exercise UUID',
    }),
    ApiResponse({
      status: 204,
      description: 'Exercise deleted successfully',
      schema: {
        example: {
          success: true,
          message: 'Exercise deleted successfully',
          data: undefined,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Only administrators can delete exercises',
    }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}

