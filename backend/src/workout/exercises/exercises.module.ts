import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercises.entity';
import { AccountsModule } from 'src/users/accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise]), AccountsModule],
  providers: [ExercisesService],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
