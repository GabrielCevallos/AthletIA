import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MeasurementRequest, MeasurementUpdate, MyMeasurementResponse } from './dto/measurements.dto';

export function ApiListMeasurements() {
  return applyDecorators(
    ApiOperation({
      summary: 'List measurements (admin use)',
      description: 'Get all measurements. Only accessible by administrators.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Measurements retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Measurements retrieved successfully',
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              weight: 75.5,
              height: 180,
              imc: 23.3,
              left_arm: 35,
              right_arm: 35,
              left_forearm: 28,
              right_forearm: 28,
              clavicular_width: 38,
              neck_diameter: 38,
              chest_size: 98,
              back_width: 42,
              hip_diameter: 98,
              left_leg: 60,
              right_leg: 60,
              left_calve: 38,
              right_calve: 38,
              checkTime: 'WEEKLY',
              createdAt: '2024-01-01T10:00:00Z',
              updatedAt: '2024-01-01T10:00:00Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
  );
}

export function ApiGetMyMeasurement() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get my measurement',
      description: 'Retrieve the authenticated user\'s current measurement.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Measurement retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Measurement retrieved successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            weight: 75.5,
            height: 180,
            imc: 23.3,
            left_arm: 35,
            right_arm: 35,
            left_forearm: 28,
            right_forearm: 28,
            clavicular_width: 38,
            neck_diameter: 38,
            chest_size: 98,
            back_width: 42,
            hip_diameter: 98,
            left_leg: 60,
            right_leg: 60,
            left_calve: 38,
            right_calve: 38,
            checkTime: 'morning',
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
      status: 404,
      description: 'Measurement not found',
    }),
  );
}

export function ApiCreateMeasurement() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create or update measurement',
      description: 'Create a new measurement or update existing one for authenticated user.',
    }),
    ApiBearerAuth(),
    ApiBody({ type: MeasurementRequest }),
    ApiResponse({
      status: 201,
      description: 'Measurement created successfully',
      schema: {
        example: {
          success: true,
          message: 'Measurement created successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            weight: 75.5,
            height: 180,
            imc: 23.3,
            left_arm: 35,
            right_arm: 35,
            left_forearm: 28,
            right_forearm: 28,
            clavicular_width: 38,
            neck_diameter: 38,
            chest_size: 98,
            back_width: 42,
            hip_diameter: 98,
            left_leg: 60,
            right_leg: 60,
            left_calve: 38,
            right_calve: 38,
            checkTime: 'morning',
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
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
            'weight must be a positive number',
            'height must be a positive number',
            'left_arm must be a positive number',
            'checkTime must be one of: DAILY, WEEKLY, MONTHLY',
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

export function ApiUpdateMeasurement() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update measurement',
      description: 'Update the authenticated user\'s measurement.',
    }),
    ApiBearerAuth(),
    ApiBody({ type: MeasurementUpdate }),
    ApiResponse({
      status: 200,
      description: 'Measurement updated successfully',
      schema: {
        example: {
          success: true,
          message: 'Measurement updated successfully',
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            weight: 76.0,
            height: 180,
            imc: 23.5,
            left_arm: 35.5,
            right_arm: 35.5,
            left_forearm: 28.5,
            right_forearm: 28.5,
            clavicular_width: 38,
            neck_diameter: 38,
            chest_size: 99,
            back_width: 42,
            hip_diameter: 99,
            left_leg: 60.5,
            right_leg: 60.5,
            left_calve: 38.5,
            right_calve: 38.5,
            checkTime: 'morning',
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-02T11:30:00Z',
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
            'weight must be a positive number',
            'checkTime must be one of: DAILY, WEEKLY, MONTHLY',
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
      status: 404,
      description: 'Measurement not found',
    }),
  );
}

export function ApiDeleteMeasurement() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete measurement',
      description: 'Delete the authenticated user\'s measurement.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 204,
      description: 'Measurement deleted successfully',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid authentication token',
    }),
    ApiResponse({
      status: 404,
      description: 'Measurement not found',
    }),
  );
}
