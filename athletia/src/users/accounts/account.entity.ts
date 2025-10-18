import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountStatus } from './enum/account-status.enum';
import { Role } from './enum/role.enum';
import { Profile } from 'src/users/profiles/profile.entity';

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
    enum: AccountStatus,
    default: AccountStatus.UNPROFILED,
  })
  status: AccountStatus;

  @OneToOne(() => Profile, (profile) => profile.account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @Column({ type: 'text', nullable: true })
  refreshTokenHash: string | null;
}
