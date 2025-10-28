import {
    ArrayMinSize,
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
import { ApiProperty } from '@nestjs/swagger';
import { RoutineGoal } from '../enum/routine-goal.enum';
import { Exercise } from '../../exercises/exercises.entity';

export class RoutineRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ minLength: 3, maxLength: 50 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  @ApiProperty({ minLength: 10, maxLength: 500 })
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'uuid' } })
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
  @ArrayMinSize(1)
  @ApiProperty({ type: 'array', items: { type: 'string', enum: Object.values(RoutineGoal) } })
  routineGoal: RoutineGoal[];

  @IsBoolean()
  @ApiProperty()
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
  @ArrayMinSize(1)
  routineGoal?: RoutineGoal[];

  @IsBoolean()
  @IsOptional()
  official?: boolean;
}
