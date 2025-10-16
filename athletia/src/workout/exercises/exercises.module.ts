import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercises.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise]),
  ],
  providers: [ExercisesService],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
