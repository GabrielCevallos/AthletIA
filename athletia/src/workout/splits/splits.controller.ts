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
import { SplitsService } from './splits.service';
import { SplitRequest, SplitUpdate } from './dto/splits.dto';
import { ApiResponse } from '../../common/interfaces/api-response';
import { Split } from './splits.entity';

@Controller('workout/splits')
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSplitDto: SplitRequest,
  ): Promise<ApiResponse<Split>> {
    const data = await this.splitsService.create(createSplitDto);
    return new ApiResponse(true, 'Split created successfully', data);
  }

  @Get()
  async findAll(): Promise<ApiResponse<Split[]>> {
    const data = await this.splitsService.findAll();
    return new ApiResponse(true, 'Splits retrieved successfully', data);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<Split>> {
    const data = await this.splitsService.findOne(id);
    return new ApiResponse(true, 'Split retrieved successfully', data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSplitDto: SplitUpdate,
  ): Promise<ApiResponse<Split>> {
    const data = await this.splitsService.update(id, updateSplitDto);
    return new ApiResponse(true, 'Split updated successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<null>> {
    await this.splitsService.remove(id);
    return new ApiResponse(true, 'Split deleted successfully');
  }
}
