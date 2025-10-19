import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator';
import { RoutineGoal } from '../enum/routine-goal.enum';

export class RoutineRequest {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    description: string;

    @IsNumber()
    @IsPositive()
    @IsInt()
    nExercises: number;

    @IsEnum(RoutineGoal, {
        message: `Each routineGoal must be one of: ${Object.values(RoutineGoal).join(
            ', ',
        )}`,
    })
    @IsNotEmpty()
    routineGoal: RoutineGoal;

    @IsBoolean()
    official: boolean;
}

export class Routine extends RoutineRequest {
    @IsUUID()
    id: string;

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}

export class RoutineUpdate {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(3)
    @MaxLength(50)
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(10)
    @MaxLength(500)
    description?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @IsInt()
    nExercises?: number;

    @IsEnum(RoutineGoal, {
        message: `Each routineGoal must be one of of: ${Object.values(
            RoutineGoal,
        ).join(', ')}`,
    })
    @IsNotEmpty()
    @IsOptional()
    routineGoal?: RoutineGoal;

    @IsBoolean()
    @IsOptional()
    official?: boolean;
}
