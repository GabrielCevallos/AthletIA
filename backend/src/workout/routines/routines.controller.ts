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
import { ResponseBody } from '../../common/response/api.response';
import { Routine } from './routines.entity';
import {
  ApiCreateRoutine,
  ApiListRoutines,
  ApiGetRoutine,
  ApiUpdateRoutine,
  ApiDeleteRoutine,
} from './swagger.decorators';

@Controller('workout/routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateRoutine()
  async create(
    @Body() createRoutineDto: RoutineRequest,
  ): Promise<ResponseBody<Routine>> {
    const data = await this.routinesService.create(createRoutineDto);
    return new ResponseBody(true, 'Routine created successfully', data);
  }

  @Get()
  @ApiListRoutines()
  async findAll(): Promise<ResponseBody<Routine[]>> {
    const data = await this.routinesService.findAll();
    return new ResponseBody(true, 'Routines retrieved successfully', data);
  }

  @Get(':id')
  @ApiGetRoutine()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseBody<Routine>> {
    const data = await this.routinesService.findOne(id);
    return new ResponseBody(true, 'Routine retrieved successfully', data);
  }

  @Patch(':id')
  @ApiUpdateRoutine()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoutineDto: RoutineUpdate,
  ): Promise<ResponseBody<Routine>> {
    const data = await this.routinesService.update(id, updateRoutineDto);
    return new ResponseBody(true, 'Routine updated successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteRoutine()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseBody<null>> {
    await this.routinesService.remove(id);
    return new ResponseBody(true, 'Routine deleted successfully');
  }
}
