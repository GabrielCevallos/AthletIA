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
  ParseUUIDPipe,
} from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutineRequest, RoutineUpdate } from './dto/routines.dto';
import { ApiResponse } from '../../common/response/api.response';
import { Routine } from './routines.entity';

@Controller('workout/routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRoutineDto: RoutineRequest,
  ): Promise<ApiResponse<Routine>> {
    const data = await this.routinesService.create(createRoutineDto);
    return new ApiResponse(true, 'Routine created successfully', data);
  }

  @Get()
  async findAll(): Promise<ApiResponse<Routine[]>> {
    const data = await this.routinesService.findAll();
    return new ApiResponse(true, 'Routines retrieved successfully', data);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<Routine>> {
    const data = await this.routinesService.findOne(id);
    return new ApiResponse(true, 'Routine retrieved successfully', data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoutineDto: RoutineUpdate,
  ): Promise<ApiResponse<Routine>> {
    const data = await this.routinesService.update(id, updateRoutineDto);
    return new ApiResponse(true, 'Routine updated successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<null>> {
    await this.routinesService.remove(id);
    return new ApiResponse(true, 'Routine deleted successfully');
  }
}
