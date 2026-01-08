import { 
  Controller, 
  Get, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { MeasurementRequest, MeasurementUpdate, MyMeasurementResponse } from './dto/measurements.dto';
import { ResponseBody } from 'src/common/response/api.response';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Measurement as MeasurementEntity } from './measurements.entity';

@UseGuards(AuthGuard)
@ApiTags('Measurements')
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}
  private toMyResponse(m: MeasurementEntity): MyMeasurementResponse {
    const {
      id, weight, height, imc,
      left_arm, right_arm, left_forearm, right_forearm,
      clavicular_width, neck_diameter, chest_size, back_width, hip_diameter,
      left_leg, right_leg, left_calve, right_calve,
      checkTime, createdAt, updatedAt,
    } = m;
    return {
      id, weight, height, imc,
      left_arm, right_arm, left_forearm, right_forearm,
      clavicular_width, neck_diameter, chest_size, back_width, hip_diameter,
      left_leg, right_leg, left_calve, right_calve,
      checkTime: checkTime as string, createdAt, updatedAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all measurements (admin use)' })
  @ApiOkResponse({
    description: 'Measurements retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Measurements retrieved successfully' },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(MyMeasurementResponse) },
        },
      },
    },
  })
  async findAll() {
    const measurements = await this.measurementsService.findAll();
    return ResponseBody.success(
      measurements,
      'Measurements retrieved successfully'
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my measurement' })
  @ApiOkResponse({
    description: 'Measurement retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Measurement retrieved successfully' },
        data: { $ref: getSchemaPath(MyMeasurementResponse) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Measurement not found' })
  async getMyMeasurement(@Req() req: Request & { user?: any }) {
    const accountId = req.user.sub;
    const measurement = await this.measurementsService.findByAccountId(accountId);
    if (!measurement) {
      return ResponseBody.success(
        null,
        'No measurement found for this account'
      );
    }
    return ResponseBody.success(
      measurement,
      'Measurement retrieved successfully'
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a measurement by id (admin use)' })
  @ApiOkResponse({
    description: 'Measurement retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Measurement retrieved successfully' },
        data: { $ref: getSchemaPath(MyMeasurementResponse) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Measurement not found' })
  async findOne(@Param('id') id: string) {
    const measurement = await this.measurementsService.findOne(id);
    return ResponseBody.success(
      measurement,
      'Measurement retrieved successfully'
    );
  }

  // Authenticated upsert edit for the current user's account
  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update my measurement (upsert)' })
  @ApiBody({
    description: 'When creating for the first time, send required fields. For updates, all fields are optional.',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MeasurementRequest) },
        { $ref: getSchemaPath(MeasurementUpdate) },
      ],
    },
    examples: {
      create: {
        summary: 'First time (create)',
        value: {
          weight: 75,
          height: 175,
          checkTime: 'MORNING',
          left_arm: 32.5,
        },
      },
      update: {
        summary: 'Subsequent edit (update)',
        value: {
          weight: 76.2,
          left_arm: 33.0,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Measurement edited successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Measurement edited successfully' },
        data: { $ref: getSchemaPath(MyMeasurementResponse) },
      },
    },
  })
  async editMyMeasurement(
    @Req() req: Request & { user?: any },
    @Body() body: any,
  ) {
    const accountId = req.user.sub;
    const existing = await this.measurementsService.findByAccountId(accountId);

    if (existing) {
      const dto = plainToInstance(MeasurementUpdate, body);
      await validateOrReject(dto as any);
      const measurement = await this.measurementsService.editForAccount(accountId, dto);
      const response = this.toMyResponse(measurement);
      return ResponseBody.success(
        response,
        'Measurement edited successfully'
      );
    }

    const createDto = plainToInstance(MeasurementRequest, body);
    await validateOrReject(createDto as any);
    const measurement = await this.measurementsService.editForAccount(accountId, createDto as any);
    const response = this.toMyResponse(measurement);
    return ResponseBody.success(
      response,
      'Measurement edited successfully'
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a measurement by id (admin use)' })
  @ApiNoContentResponse({ description: 'Measurement deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.measurementsService.remove(id);
    return ResponseBody.success(
      null,
      'Measurement deleted successfully'
    );
  }
}



