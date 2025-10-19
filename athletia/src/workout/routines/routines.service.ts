import { Injectable, NotFoundException } from '@nestjs/common';
import { Routine } from './routines.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { RoutineRequest } from './dto/routines.dto';

@Injectable()
export class RoutinesService {
    constructor(
        @InjectRepository(Routine)
        private routinesRepository: Repository<Routine>,
    ) { }

    async create(
        routineDto: RoutineRequest
    ): Promise<Routine> {
        const newRoutine = this.routinesRepository.create(routineDto);
        return await this.routinesRepository.save(newRoutine);
    }

    async findAll(): Promise<Routine[]> {
        return await this.routinesRepository.find();
    }

    async findOne(id: string): Promise<Routine> {
        const routine = await this.routinesRepository.findOne({ where: { id } });
        if (!routine) {
            throw new NotFoundException(`Routine with id ${id} not found`);
        }
        return routine;
    }

    async update(id: string, routineDto: RoutineRequest): Promise<Routine> {
        const routine = await this.findOne(id);
        this.routinesRepository.merge(routine, routineDto);
        return await this.routinesRepository.save(routine);
    }
    
    async remove(id: string): Promise<void> {
        const routine = await this.findOne(id);
        await this.routinesRepository.remove(routine);
    }


}
