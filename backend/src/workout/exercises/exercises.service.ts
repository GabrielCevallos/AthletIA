import { Injectable, NotFoundException } from '@nestjs/common';
import { Exercise } from './exercises.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRequest, ExerciseUpdate } from './dto/exercises.dto';
import { PaginationRequest } from '../../common/request/pagination.request.dto';
import { PaginationResponse } from '../../common/interfaces/pagination-response.interface';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async create(exerciseDto: ExerciseRequest): Promise<Exercise> {
    const newExercise = this.exercisesRepository.create(exerciseDto);
    return await this.exercisesRepository.save(newExercise);
  }

  async findAll(
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Exercise>> {
    const limit = pagination.limit || 10;
    const offset = pagination.offset || 0;

    const [items, total] = await this.exercisesRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      items,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({ where: { id } });
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
    return exercise;
  }

  async update(id: string, exerciseDto: ExerciseUpdate): Promise<Exercise> {
    const exercise = await this.findOne(id);
    this.exercisesRepository.merge(exercise, exerciseDto);
    return await this.exercisesRepository.save(exercise);
  }

  async remove(id: string): Promise<void> {
    const exercise = await this.findOne(id);
    await this.exercisesRepository.remove(exercise);
  }
}
