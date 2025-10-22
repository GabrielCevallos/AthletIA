import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Repetition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  minReps: number;

  @Column()
  maxReps: number;

  @Column()
  updatedAt: Date;
}
