import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExerciseType } from './enum/exercise-type.enum';
import { MuscleTarget } from './enum/muscle-target.enum';
import { Routine } from '../routines/routines.entity';
import { Equipment } from './enum/equipment.enum';

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

  @Column({ type: 'enum', enum: Equipment, default: Equipment.BODYWEIGHT })
  equipment: Equipment;

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

  @Column({ type: 'text', array: true, default: '{}' })
  instructions: string[];

  @Column({ type: 'jsonb', nullable: true })
  benefit: {
    title: string;
    description?: string;
    categories?: string[];
  } | null;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  mediaFiles: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    data: string;
  }>;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  coverUrl: string;

  @Column({ default: false })
  isSeed: boolean;

  @ManyToOne(() => Exercise, (exercise) => exercise.variants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentExerciseId' })
  parentExercise: Exercise | null;

  @OneToMany(() => Exercise, (exercise) => exercise.parentExercise)
  variants: Exercise[];

  @ManyToMany(() => Routine, (routine) => routine.exercises)
  routines: Routine[];
}
