import {
    Column,
    Entity,

    JoinColumn,

    ManyToMany,

    PrimaryGeneratedColumn
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

    @Column()
    nExercises: number;

    @Column({
        type: 'enum',
        enum: RoutineGoal,
    })
    routineGoal: RoutineGoal;

    @Column()
    updatedAt: Date;

    @Column()
    official: boolean;

    @ManyToMany(() => Exercise, (exercise) => exercise.routines)
    @JoinColumn()
    exercise: Exercise;
}