import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExerciseType } from './enum/exercise-type.enum';
import { MuscleTarget } from './enum/muscle-target.enum';
import { Routine } from '../routines/routines.entity';
import { SetType } from './enum/set-type.enum';

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

  @Column({ default: 1 })
  minSets: number;

  @Column()
  maxSets: number;

  @Column({ default: 1 })
  minReps: number;

  @Column()
  maxReps: number;

  @Column()
  minRestTime: number;

  @Column()
  maxRestTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: ExerciseType, array: true })
  exerciseType: ExerciseType[];

  @Column({ type: 'enum', enum: MuscleTarget, array: true })
  muscleTarget: MuscleTarget[];

  @Column({ type: 'enum', enum: SetType, array: true })
  setType: SetType[];

  @ManyToMany(() => Routine, (routine) => routine.exercises)
  routines: Routine[];
}
