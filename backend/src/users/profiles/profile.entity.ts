import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from './enum/gender.enum';
import { Account } from 'src/users/accounts/account.entity';
import { RoutineGoal } from 'src/workout/routines/enum/routine-goal.enum';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  birthDate: Date;

  @Column()
  phoneNumber: string;

  @Column()
  createdAt: Date;
  
  @Column()
  updatedAt: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: RoutineGoal, array: true })
  fitGoals: RoutineGoal[];

  @OneToOne(() => Account, (account) => account.profile)
  @JoinColumn()
  account: Account;
}
