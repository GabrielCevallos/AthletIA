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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoutineGoal } from '../enum/routine-goal.enum';
import { Exercise } from '../../exercises/exercises.entity';

export class RoutineRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ description: 'Routine name', minLength: 3, maxLength: 50, example: 'Upper/Lower Hypertrophy' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  @ApiProperty({ description: 'Routine description', minLength: 10, maxLength: 500, example: '4-day program focused on strength and hypertrophy.' })
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @ApiProperty({ description: 'Associated exercise IDs', type: [String], format: 'uuid', required: false })
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
  @ApiProperty({ description: 'Routine goals', enum: RoutineGoal, isArray: true })
  routineGoal: RoutineGoal[];

  @IsBoolean()
  @ApiProperty({ description: 'Official routine flag', example: false })
  official: boolean;
}

export class Routine extends RoutineRequest {
  @IsUUID()
  @ApiProperty({ description: 'Routine ID', format: 'uuid' })
  id: string;

  @IsDate()
  @ApiProperty({ description: 'Creation date', type: Date })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: 'Last update date', type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Associated exercises' })
  exercises?: Exercise[];
}

export class RoutineUpdate {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @ApiPropertyOptional({ description: 'Routine name', minLength: 3, maxLength: 50, example: 'Upper/Lower Hypertrophy' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(10)
  @MaxLength(500)
  @ApiPropertyOptional({ description: 'Routine description', minLength: 10, maxLength: 500 })
  description?: string;

  @IsOptional()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({ description: 'Associated exercise IDs', type: [String], format: 'uuid' })
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
  @ApiPropertyOptional({ description: 'Routine goals', enum: RoutineGoal, isArray: true })
  routineGoal?: RoutineGoal[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Official routine flag', example: false })
  official?: boolean;
}
