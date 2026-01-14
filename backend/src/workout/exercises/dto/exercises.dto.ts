import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MuscleTarget } from '../enum/muscle-target.enum';
import { ExerciseType } from '../enum/exercise-type.enum';
import { Equipment } from '../enum/equipment.enum';

export class ExerciseRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'Exercise name',
    minLength: 3,
    maxLength: 50,
    example: 'Bench Press',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  @ApiProperty({
    description: 'Exercise description',
    minLength: 10,
    maxLength: 500,
    example: 'Barbell bench press on a flat bench.',
  })
  description: string;

  @IsEnum(Equipment, {
    message: `Equipment must be one of: ${Object.values(Equipment).join(', ')}`,
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Equipment required for the exercise',
    enum: Equipment,
    example: Equipment.BARBELL,
  })
  equipment: Equipment;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Parent exercise ID if this is a variant',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  parentExerciseId?: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Demo video URL',
    example: 'https://example.com/video',
  })
  video: string;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @ApiProperty({ description: 'Minimum sets', minimum: 1, example: 3 })
  minSets: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(10)
  @ApiProperty({ description: 'Maximum sets', maximum: 10, example: 5 })
  maxSets: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @ApiProperty({ description: 'Minimum reps', minimum: 1, example: 8 })
  minReps: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(60)
  @ApiProperty({ description: 'Maximum reps', maximum: 60, example: 15 })
  maxReps: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(10)
  @ApiProperty({
    description: 'Minimum rest time in seconds',
    minimum: 10,
    example: 60,
  })
  minRestTime: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(600)
  @ApiProperty({
    description: 'Maximum rest time in seconds',
    maximum: 600,
    example: 120,
  })
  maxRestTime: number;

  @IsArray()
  @IsEnum(MuscleTarget, {
    each: true,
    message: `Each muscleTarget must be one of: ${Object.values(
      MuscleTarget,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Target muscles',
    enum: MuscleTarget,
    isArray: true,
  })
  muscleTarget: MuscleTarget[];

  @IsArray()
  @IsEnum(ExerciseType, {
    each: true,
    message: `Each exerciseType must be one of: ${Object.values(
      ExerciseType,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Exercise types',
    enum: ExerciseType,
    isArray: true,
  })
  exerciseType: ExerciseType[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Exercise instructions (steps)',
    type: [String],
    example: ['Step 1: Position yourself', 'Step 2: Execute the movement'],
  })
  instructions?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Exercise benefit information',
    example: {
      title: 'Increases strength',
      description: 'Builds chest and triceps strength',
      categories: ['Cardio', 'Fuerza', 'Resistencia'],
    },
  })
  benefit?: {
    title: string;
    description?: string;
    categories?: string[];
  };
}

export class Exercise extends ExerciseRequest {
  @IsUUID()
  @ApiProperty({ description: 'Exercise ID', format: 'uuid' })
  id: string;

  @IsDate()
  @ApiProperty({ description: 'Creation date', type: Date })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: 'Last update date', type: Date })
  updatedAt: Date;
}

export class ExerciseUpdate {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Exercise name',
    minLength: 3,
    maxLength: 50,
    example: 'Bench Press',
  })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(10)
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'Exercise description',
    minLength: 10,
    maxLength: 500,
    example: 'Barbell bench press on a flat bench.',
  })
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Demo video URL',
    example: 'https://example.com/video',
  })
  video?: string;

  @IsEnum(Equipment, {
    message: `Equipment must be one of: ${Object.values(Equipment).join(', ')}`,
  })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Equipment required for the exercise',
    enum: Equipment,
    example: Equipment.BARBELL,
  })
  equipment?: Equipment;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(1)
  @ApiPropertyOptional({ description: 'Minimum sets', minimum: 1, example: 3 })
  minSets?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Max(10)
  @ApiPropertyOptional({ description: 'Maximum sets', maximum: 10, example: 5 })
  maxSets?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(1)
  @ApiPropertyOptional({ description: 'Minimum reps', minimum: 1, example: 8 })
  minReps?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Max(60)
  @ApiPropertyOptional({ description: 'Maximum reps', maximum: 60, example: 15 })
  maxReps?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(10)
  @ApiPropertyOptional({
    description: 'Minimum rest time in seconds',
    minimum: 10,
    example: 60,
  })
  minRestTime?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Max(600)
  @ApiPropertyOptional({
    description: 'Maximum rest time in seconds',
    maximum: 600,
    example: 120,
  })
  maxRestTime?: number;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Parent exercise ID if this is a variant',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  parentExerciseId?: string;

  @IsArray()
  @IsEnum(MuscleTarget, {
    each: true,
    message: `Each muscleTarget must be one of: ${Object.values(
      MuscleTarget,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @IsOptional()
  @ArrayMinSize(1)
  @ApiPropertyOptional({
    description: 'Target muscles',
    enum: MuscleTarget,
    isArray: true,
  })
  muscleTarget?: MuscleTarget[];

  @IsArray()
  @IsEnum(ExerciseType, {
    each: true,
    message: `Each exerciseType must be one of: ${Object.values(
      ExerciseType,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @IsOptional()
  @ArrayMinSize(1)
  @ApiPropertyOptional({
    description: 'Exercise types',
    enum: ExerciseType,
    isArray: true,
  })
  exerciseType?: ExerciseType[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Exercise instructions (steps)',
    type: [String],
    example: ['Step 1: Position yourself', 'Step 2: Execute the movement'],
  })
  instructions?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Exercise benefit information',
    example: {
      title: 'Increases strength',
      description: 'Builds chest and triceps strength',
      categories: ['Cardio', 'Fuerza', 'Resistencia'],
    },
  })
  benefit?: {
    title: string;
    description?: string;
    categories?: string[];
  };
}
