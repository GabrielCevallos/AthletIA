import { Injectable, NotFoundException } from '@nestjs/common';
import { Split } from './splits.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SplitRequest, SplitUpdate } from './dto/splits.dto';
import { Routine } from '../routines/routines.entity';
import { In } from 'typeorm';

@Injectable()
export class SplitsService {
  constructor(
    @InjectRepository(Split)
    private splitsRepository: Repository<Split>,
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
  ) {}

  async create(splitDto: SplitRequest): Promise<Split> {
    const newSplit = this.splitsRepository.create(splitDto);
    if (splitDto.routineIds && splitDto.routineIds.length) {
      const routines = await this.routinesRepository.find({
        where: { id: In(splitDto.routineIds) },
      });
      const splitDays = 7;
      newSplit.routines = routines;
      // Auto-calculate number of training and rest days
      newSplit.nTrainingDays = routines.length;
      newSplit.nRestDays = splitDays - newSplit.nTrainingDays;
    }
    return await this.splitsRepository.save(newSplit);
  }

  async findAll(): Promise<Split[]> {
    return await this.splitsRepository.find({ relations: ['routines'] });
  }

  async findOne(id: string): Promise<Split> {
    const split = await this.splitsRepository.findOne({
      where: { id },
      relations: ['routines'],
    });
    if (!split) {
      throw new NotFoundException(`Split with id ${id} not found`);
    }
    return split;
  }

  async update(id: string, splitDto: SplitUpdate): Promise<Split> {
    const split = await this.findOne(id);
    this.splitsRepository.merge(split, splitDto);
    if (splitDto.routineIds) {
      const routines = await this.routinesRepository.find({
        where: { id: In(splitDto.routineIds) },
      });
      const splitDays = 7;
      split.routines = routines;
      // Auto-calculate number of training and rest days
      split.nTrainingDays = routines.length;
      split.nRestDays = splitDays - split.nTrainingDays;
    }
    return await this.splitsRepository.save(split);
  }

  async remove(id: string): Promise<void> {
    const split = await this.findOne(id);
    await this.splitsRepository.remove(split);
  }
}
