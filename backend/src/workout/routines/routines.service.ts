import { Injectable, NotFoundException } from '@nestjs/common';
import { Routine } from './routines.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutineRequest, RoutineUpdate } from './dto/routines.dto';
import { Exercise } from '../exercises/exercises.entity';
import { In } from 'typeorm';
import { PaginationRequest } from '../../common/request/pagination.request.dto';
import { PaginationResponse } from '../../common/interfaces/pagination-response.interface';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/enum/notification-type.enum';
import { NotificationCategory } from '../../notifications/enum/notification-category.enum';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    routineDto: RoutineRequest,
    userId: string,
    isAdmin: boolean,
  ): Promise<Routine> {
    const newRoutine = this.routinesRepository.create(routineDto);
    newRoutine.userId = userId;
    
    // If admin creates a routine, set official to true
    if (isAdmin) {
      newRoutine.official = true;
    } else {
      newRoutine.official = false;
    }

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
    const savedRoutine = await this.routinesRepository.save(newRoutine);

    // Send notification
    await this.notificationsService.create(
      userId,
      'Rutina creada',
      `La rutina "${savedRoutine.name}" ha sido creada exitosamente.`,
      NotificationType.SUCCESS,
      NotificationCategory.ROUTINE,
    );

    return savedRoutine;
  }

  async findAll(
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Routine>> {
    const limit = pagination.limit || 10;
    const offset = pagination.offset || 0;

    const [items, total] = await this.routinesRepository.findAndCount({
      relations: ['exercises'],
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
    const updatedRoutine = await this.routinesRepository.save(routine);
    
    // Send notification
    if (routine.userId) {
      await this.notificationsService.create(
        routine.userId,
        'Rutina actualizada',
        `La rutina "${updatedRoutine.name}" ha sido actualizada.`,
        NotificationType.INFO,
        NotificationCategory.ROUTINE,
      );
    }

    return updatedRoutine;
  }

  async remove(id: string): Promise<void> {
    const routine = await this.findOne(id);
    await this.routinesRepository.remove(routine);
  }
}
