import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountState } from './enum/account-states.enum';
import { Role } from './enum/role.enum';
import { Profile } from 'src/users/profiles/profile.entity';
import { Measurement } from 'src/measurements/measurements.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: AccountState,
  })
  status: AccountState;

  @OneToOne(() => Profile, (profile) => profile.account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false})
  hasProfile: boolean;

  @Column({ type: 'int', default: 0 })
  verificationResendCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastVerificationSentAt: Date | null;

  @Column({ type: 'text', nullable: true })
  refreshTokenHash: string | null;

  @OneToOne(() => Measurement, (measurement) => measurement.account)
  measurement: Measurement;
}
