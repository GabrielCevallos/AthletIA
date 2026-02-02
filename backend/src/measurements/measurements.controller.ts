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
  Post,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { MeasurementRequest, MeasurementUpdate, MyMeasurementResponse } from './dto/measurements.dto';
import { ResponseBody } from 'src/common/response/api.response';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Measurement as MeasurementEntity } from './measurements.entity';
import {
  ApiListMeasurements,
  ApiGetMyMeasurement,
  ApiCreateMeasurement,
  ApiUpdateMeasurement,
  ApiDeleteMeasurement,
} from './swagger.decorators';

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
  @ApiListMeasurements()
  async findAll() {
    const measurements = await this.measurementsService.findAll();
    return ResponseBody.success(
      measurements,
      'Measurements retrieved successfully'
    );
  }

  @Get('me')
  @ApiGetMyMeasurement()
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

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateMeasurement()
  async createMyMeasurement(
    @Req() req: Request & { user?: any },
    @Body() body: MeasurementRequest,
  ) {
    const accountId = req.user.sub;
    const measurement = await this.measurementsService.editForAccount(accountId, body);
    const response = this.toMyResponse(measurement);
    return ResponseBody.success(
      response,
      'Measurement created successfully'
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a measurement by id (admin use)' })
  @ApiOkResponse({
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
  @ApiUpdateMeasurement()
  async editMyMeasurement(
    @Req() req: Request & { user?: any },
    @Body() body: MeasurementUpdate,
  ) {
    const accountId = req.user.sub;
    const measurement = await this.measurementsService.editForAccount(accountId, body);
    const response = this.toMyResponse(measurement);
    return ResponseBody.success(
      response,
      'Measurement edited successfully'
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteMeasurement()
  async remove(@Param('id') id: string) {
    await this.measurementsService.remove(id);
    return ResponseBody.success(
      null,
      'Measurement deleted successfully'
    );
  }
}



