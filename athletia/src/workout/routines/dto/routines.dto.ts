import {
    ArrayNotEmpty,
    IsArray,
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
import { Exercise } from '../../exercises/exercises.entity';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  exerciseIds?: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoutineGoal, {
    each: true,
    message: `Each routineGoal must be one of: ${Object.values(
      RoutineGoal,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  routineGoal: RoutineGoal[];

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

  exercises?: Exercise[];
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

  @IsOptional()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  exerciseIds?: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoutineGoal, {
    each: true,
    message: `Each routineGoal must be one of: ${Object.values(
      RoutineGoal,
    ).join(', ')}`,
  })
  @IsOptional()
  routineGoal?: RoutineGoal[];

  @IsBoolean()
  @IsOptional()
  official?: boolean;
}
