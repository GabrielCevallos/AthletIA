import { Injectable, NotFoundException } from '@nestjs/common';
import { Exercise } from './exercises.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRequest, ExerciseUpdate, ExerciseFilterRequest } from './dto/exercises.dto';
import { PaginationResponse } from '../../common/interfaces/pagination-response.interface';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async create(exerciseDto: ExerciseRequest): Promise<Exercise> {
    const newExercise = this.exercisesRepository.create({
      ...exerciseDto,
      parentExercise: exerciseDto.parentExerciseId
        ? { id: exerciseDto.parentExerciseId } as Exercise
        : null,
    });
    return await this.exercisesRepository.save(newExercise);
  }

  async findAll(
    query: ExerciseFilterRequest,
  ): Promise<PaginationResponse<Exercise>> {
    const limit = query.limit || 10;
    const offset = query.offset || 0;

    const queryBuilder = this.exercisesRepository
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.parentExercise', 'parentExercise')
      .leftJoinAndSelect('exercise.variants', 'variants')
      .take(limit)
      .skip(offset);

    if (query.muscleTarget && query.muscleTarget.length > 0) {
      queryBuilder.andWhere('exercise.muscleTarget && ARRAY[:...muscleTarget]::exercise_muscletarget_enum[]', {
        muscleTarget: query.muscleTarget,
      });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({
      where: { id },
      relations: ['parentExercise', 'variants'],
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
    return exercise;
  }

  async update(id: string, exerciseDto: ExerciseUpdate): Promise<Exercise> {
    const exercise = await this.findOne(id);
    
    const updateData: any = { ...exerciseDto };
    
    if (exerciseDto.parentExerciseId !== undefined) {
      updateData.parentExercise = exerciseDto.parentExerciseId
        ? { id: exerciseDto.parentExerciseId } as Exercise
        : null;
      delete updateData.parentExerciseId;
    }
    
    this.exercisesRepository.merge(exercise, updateData);
    return await this.exercisesRepository.save(exercise);
  }

  async remove(id: string): Promise<void> {
    const exercise = await this.findOne(id);
    await this.exercisesRepository.remove(exercise);
  }
}
