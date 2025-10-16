import {
    Column,
    Entity,
    JoinColumn,

    PrimaryGeneratedColumn,
} from 'typeorm';
import { SetType } from './enum/set-type.enum';

@Entity()
export class WorkingSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column()
    minSets: number;

    @Column()
    maxSets: number;

    @Column()
    updatedAt: Date;

    @Column({ type: 'enum', enum: SetType })
    type: SetType;
}
