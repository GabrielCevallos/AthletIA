import { Module } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './routines.entity';
import { Exercise } from '../exercises/exercises.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Routine, Exercise])],
  providers: [RoutinesService],
  controllers: [RoutinesController],
})
export class RoutinesModule {}
