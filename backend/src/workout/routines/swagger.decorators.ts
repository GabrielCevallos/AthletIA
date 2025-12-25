import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Routine, RoutineRequest, RoutineUpdate } from './dto/routines.dto';

export function ApiCreateRoutine() {
  return applyDecorators(
    ApiOperation({ summary: 'Create routine' }),
    ApiBody({ type: RoutineRequest }),
    ApiResponse({ status: 201, description: 'Routine created', type: Routine }),
  );
}

export function ApiListRoutines() {
  return applyDecorators(
    ApiOperation({ summary: 'List routines' }),
    ApiResponse({
      status: 200,
      description: 'Routine list',
      type: Routine,
      isArray: true,
    }),
  );
}

export function ApiGetRoutine() {
  return applyDecorators(
    ApiOperation({ summary: 'Get routine by ID' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiResponse({
      status: 200,
      description: 'Routine retrieved',
      type: Routine,
    }),
    ApiResponse({ status: 404, description: 'Routine not found' }),
  );
}

export function ApiUpdateRoutine() {
  return applyDecorators(
    ApiOperation({ summary: 'Update routine' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiBody({ type: RoutineUpdate }),
    ApiResponse({ status: 200, description: 'Routine updated', type: Routine }),
    ApiResponse({ status: 404, description: 'Routine not found' }),
  );
}

export function ApiDeleteRoutine() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete routine' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiResponse({ status: 204, description: 'Routine deleted' }),
    ApiResponse({ status: 404, description: 'Routine not found' }),
  );
}
