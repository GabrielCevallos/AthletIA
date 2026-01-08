import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CheckTime } from './enum/check-time.enum';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 2})
  imc: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  left_arm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  right_arm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  left_forearm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  right_forearm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  clavicular_width: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  neck_diameter: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  chest_size: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  back_width: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hip_diameter: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  left_leg: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  right_leg: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  left_calve: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  right_calve: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: CheckTime })
  checkTime: CheckTime;
}
