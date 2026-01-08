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
import { Routine } from '../routines/routines.entity';
import { Days } from './enum/days.enum';
import { Account } from 'src/users/accounts/account.entity';

@Entity()
export class Split {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  nTrainingDays: number;

  @Column({ default: 0 })
  nRestDays: number;

  @Column({ type: 'enum', enum: Days, array: true, default: '{}' })
  trainingDays: Days[];

  @CreateDateColumn()
  createdAt: Date;
    
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  official: boolean;

  @ManyToMany(() => Routine, (routine) => routine.splits)
  @JoinTable()
  routines: Routine[];
}
