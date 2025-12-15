import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Split, SplitRequest, SplitUpdate } from './dto/splits.dto';

export function ApiCreateSplit() {
  return applyDecorators(
    ApiOperation({ summary: 'Create split' }),
    ApiBody({ type: SplitRequest }),
    ApiResponse({ status: 201, description: 'Split created', type: Split }),
  );
}

export function ApiListSplits() {
  return applyDecorators(
    ApiOperation({ summary: 'List splits' }),
    ApiResponse({ status: 200, description: 'Split list', type: Split, isArray: true }),
  );
}

export function ApiGetSplit() {
  return applyDecorators(
    ApiOperation({ summary: 'Get split by ID' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiResponse({ status: 200, description: 'Split retrieved', type: Split }),
    ApiResponse({ status: 404, description: 'Split not found' }),
  );
}

export function ApiUpdateSplit() {
  return applyDecorators(
    ApiOperation({ summary: 'Update split' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiBody({ type: SplitUpdate }),
    ApiResponse({ status: 200, description: 'Split updated', type: Split }),
    ApiResponse({ status: 404, description: 'Split not found' }),
  );
}

export function ApiDeleteSplit() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete split' }),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiResponse({ status: 204, description: 'Split deleted' }),
    ApiResponse({ status: 404, description: 'Split not found' }),
  );
}
