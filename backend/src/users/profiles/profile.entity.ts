import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from './enum/gender.enum';
import { Account } from 'src/users/accounts/account.entity';

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
  updatedAt: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @OneToOne(() => Account, (account) => account.profile)
  @JoinColumn()
  account: Account;
}
