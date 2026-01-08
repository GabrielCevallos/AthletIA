import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto, UpdateMeasurementDto } from './dto/measurements.dto';
import { ApiResponse } from 'src/common/response/api.response';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeasurementDto: CreateMeasurementDto) {
    const measurement = await this.measurementsService.create(createMeasurementDto);
    return ApiResponse.success(
      measurement,
      'Measurement created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  async findAll() {
    const measurements = await this.measurementsService.findAll();
    return ApiResponse.success(
      measurements,
      'Measurements retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const measurement = await this.measurementsService.findOne(id);
    return ApiResponse.success(
      measurement,
      'Measurement retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto,
  ) {
    const measurement = await this.measurementsService.update(id, updateMeasurementDto);
    return ApiResponse.success(
      measurement,
      'Measurement updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.measurementsService.remove(id);
    return ApiResponse.success(
      null,
      'Measurement deleted successfully',
      HttpStatus.NO_CONTENT,
    );
  }
}
