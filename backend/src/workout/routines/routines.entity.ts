import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from '../exercises/exercises.entity';
import { RoutineGoal } from './enum/routine-goal.enum';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  nExercises: number;

  @Column({ type: 'enum', enum: RoutineGoal, array: true })
  routineGoal: RoutineGoal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  official: boolean;

  @ManyToMany(() => Exercise, (exercise) => exercise.routines)
  @JoinTable()
  exercises: Exercise[];
  splits: any;
}
