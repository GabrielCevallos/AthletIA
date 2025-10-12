import { Person } from 'src/persons/person.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountStatus } from './enum/account-status.enum';
import { Role } from './enum/role.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
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

  @OneToOne(() => Person, (person) => person.account, { onDelete: 'CASCADE' })
  @JoinColumn()
  person: Person;
}
