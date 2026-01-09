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
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExerciseRequest, ExerciseUpdate } from './dto/exercises.dto';
import { ResponseBody } from '../../common/response/api.response';
import { Exercise } from './exercises.entity';
import {
  ApiCreateExercise,
  ApiListExercises,
  ApiGetExercise,
  ApiUpdateExercise,
  ApiDeleteExercise,
} from './swagger.decorators';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { PaginationRequest } from '../../common/request/pagination.request.dto';
import { PaginationResponse } from '../../common/interfaces/pagination-response.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exercises')
@Controller('workout/exercises')
@UseGuards(AuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateExercise()
  async create(
    @Body() createExerciseDto: ExerciseRequest,
  ): Promise<ResponseBody<Exercise>> {
    const data = await this.exercisesService.create(createExerciseDto);
    return new ResponseBody(true, 'Exercise created successfully', data);
  }

  @Get()
  @ApiListExercises()
  async findAll(
    @Query() pagination: PaginationRequest,
  ): Promise<ResponseBody<PaginationResponse<Exercise>>> {
    const data = await this.exercisesService.findAll(pagination);
    return new ResponseBody(true, 'Exercises retrieved successfully', data);
  }

  @Get(':id')
  @ApiGetExercise()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseBody<Exercise>> {
    const data = await this.exercisesService.findOne(id);
    return new ResponseBody(true, 'Exercise retrieved successfully', data);
  }

  @Patch(':id')
  @ApiUpdateExercise()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExerciseDto: ExerciseUpdate,
  ): Promise<ResponseBody<Exercise>> {
    const data = await this.exercisesService.update(id, updateExerciseDto);
    return new ResponseBody(true, 'Exercise updated successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteExercise()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseBody<null>> {
    await this.exercisesService.remove(id);
    return new ResponseBody(true, 'Exercise deleted successfully');
  }
}
