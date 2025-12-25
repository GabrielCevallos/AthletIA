import { Injectable, NotFoundException } from '@nestjs/common';
import { Routine } from './routines.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutineRequest, RoutineUpdate } from './dto/routines.dto';
import { Exercise } from '../exercises/exercises.entity';
import { In } from 'typeorm';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async create(routineDto: RoutineRequest): Promise<Routine> {
    const newRoutine = this.routinesRepository.create(routineDto);
    if (routineDto.exerciseIds && routineDto.exerciseIds.length) {
      const exercises = await this.exercisesRepository.find({
        where: { id: In(routineDto.exerciseIds) },
      });
      newRoutine.exercises = exercises;
      // Auto-calculate number of exercises
      newRoutine.nExercises = exercises.length;
    } else {
      // Ensure DB NOT NULL constraint isn't violated: default to 0 when none provided
      newRoutine.nExercises = 0;
    }
    return await this.routinesRepository.save(newRoutine);
  }

  async findAll(): Promise<Routine[]> {
    return await this.routinesRepository.find({ relations: ['exercises'] });
  }

  async findOne(id: string): Promise<Routine> {
    const routine = await this.routinesRepository.findOne({
      where: { id },
      relations: ['exercises'],
    });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    return routine;
  }

  async update(id: string, routineDto: RoutineUpdate): Promise<Routine> {
    const routine = await this.findOne(id);
    this.routinesRepository.merge(routine, routineDto);
    if (routineDto.exerciseIds) {
      const exercises = await this.exercisesRepository.find({
        where: { id: In(routineDto.exerciseIds) },
      });
      routine.exercises = exercises;
      // Auto-calculate number of exercises
      routine.nExercises = exercises.length;
    }
    return await this.routinesRepository.save(routine);
  }

  async remove(id: string): Promise<void> {
    const routine = await this.findOne(id);
    await this.routinesRepository.remove(routine);
  }
}
