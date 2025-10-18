import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exercise } from '../exercises/exercises.entity';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  nExercises: number;

  @Column()
  updatedAt: Date;

  @Column()
  official: boolean;

  @ManyToMany(() => Exercise, (exercise) => exercise.routines)
  @JoinColumn()
  exercise: Exercise;
}
