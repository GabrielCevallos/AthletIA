import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from './enum/gender.enum';
import { Language } from './enum/language.enum';
import { Account } from 'src/users/accounts/account.entity';
import { RoutineGoal } from 'src/workout/routines/enum/routine-goal.enum';

export interface NotificationPreferences {
  routines?: boolean;
  exercises?: boolean;
  system?: boolean;
}

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

  @Column({ type: 'enum', enum: Language, default: Language.SPANISH })
  language: Language;

  @Column({ type: 'enum', enum: RoutineGoal, array: true })
  fitGoals: RoutineGoal[];

  @Column({ default: 0 })
  currentStreak: number;

  @Column({
    type: 'jsonb',
    default: { routines: true, exercises: true, system: true },
    nullable: true,
  })
  notificationPreferences: NotificationPreferences;

  @Column({ default: 0 })
  maxStreak: number;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityDate: Date;

  @OneToOne(() => Account, (account) => account.profile)
  @JoinColumn()
  account: Account;
}
