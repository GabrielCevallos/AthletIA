import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from '../exercises/exercises.entity';
import { RoutineGoal } from './enum/routine-goal.enum';
import { Account } from 'src/users/accounts/account.entity';

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

  @Column({ default: false })
  official: boolean;

  @Column()
  userId: string;

  @ManyToOne(() => Account)
  user: Account;

  @ManyToMany(() => Exercise, (exercise) => exercise.routines)
  @JoinTable()
  exercises: Exercise[];
  splits: any;
}
