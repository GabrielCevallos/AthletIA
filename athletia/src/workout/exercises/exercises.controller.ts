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
import { ExercisesService } from './exercises.service';
import { ExerciseRequest, ExerciseUpdate } from './dto/exercises.dto';
import { ApiResponse } from '../../common/interfaces/api-response';
import { Exercise } from './exercises.entity';

@Controller('workout/exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createExerciseDto: ExerciseRequest,
    ): Promise<ApiResponse<Exercise>> {
        const data = await this.exercisesService.create(createExerciseDto);
        return new ApiResponse(true, 'Exercise created successfully', data);
    }

    @Get()
    async findAll(): Promise<ApiResponse<Exercise[]>> {
        const data = await this.exercisesService.findAll();
        return new ApiResponse(true, 'Exercises retrieved successfully', data);
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Exercise>> {
        const data = await this.exercisesService.findOne(id);
        return new ApiResponse(true, 'Exercise retrieved successfully', data);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateExerciseDto: ExerciseUpdate,
    ): Promise<ApiResponse<Exercise>> {
        const data = await this.exercisesService.update(id, updateExerciseDto);
        return new ApiResponse(true, 'Exercise updated successfully', data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse<null>> {
        await this.exercisesService.remove(id);
        return new ApiResponse(true, 'Exercise deleted successfully');
    }
}
