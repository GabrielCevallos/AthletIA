import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestTime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  minTime: number;

  @Column()
  maxTime: number;

  @Column()
  updatedAt: Date;
}
