import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Exercise, ExerciseRequest, ExerciseUpdate } from './dto/exercises.dto';

export function ApiCreateExercise() {
  return applyDecorators(
    ApiOperation({ summary: 'Create exercise' }),
    ApiBody({ type: ExerciseRequest }),
    ApiResponse({ status: 201, description: 'Exercise created', type: Exercise }),
  );
}

export function ApiListExercises() {
  return applyDecorators(
    ApiOperation({ summary: 'List exercises' }),
    ApiResponse({ status: 200, description: 'Exercise list', type: Exercise, isArray: true }),
  );
}

export function ApiGetExercise() {
  return applyDecorators(
    ApiOperation({ summary: 'Get exercise by ID' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiResponse({ status: 200, description: 'Exercise retrieved', type: Exercise }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}

export function ApiUpdateExercise() {
  return applyDecorators(
    ApiOperation({ summary: 'Update exercise' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiBody({ type: ExerciseUpdate }),
    ApiResponse({ status: 200, description: 'Exercise updated', type: Exercise }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}

export function ApiDeleteExercise() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete exercise' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiResponse({ status: 204, description: 'Exercise deleted' }),
    ApiResponse({ status: 404, description: 'Exercise not found' }),
  );
}
