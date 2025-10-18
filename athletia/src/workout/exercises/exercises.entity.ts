import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExerciseType } from './enum/exercise-type.enum';
import { MuscleTarget } from './enum/muscle-target.enum';
import { Routine } from '../routines/routines.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  video: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: ExerciseType, array: true })
  exerciseType: ExerciseType[];

  @Column({ type: 'enum', enum: MuscleTarget, array: true })
  muscleTarget: MuscleTarget[];

  @OneToMany(() => Routine, (routine) => routine.exercise, { cascade: true })
  routines: Routine[];
}
