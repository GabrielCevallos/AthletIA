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
import { SetType } from '../enum/set-type.enum';

export class ExerciseRequest {
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

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ format: 'uri' })
  video: string;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @ApiProperty({ minimum: 1, example: 3 })
  minSets: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(10)
  @ApiProperty({ maximum: 10, example: 5 })
  maxSets: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @ApiProperty({ minimum: 1, example: 8 })
  minReps: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(60)
  @ApiProperty({ maximum: 60, example: 12 })
  maxReps: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Min(10)
  @ApiProperty({ minimum: 10, example: 60 })
  minRestTime: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(600)
  @ApiProperty({ maximum: 600, example: 120 })
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
  @ApiProperty({ type: 'array', items: { type: 'string', enum: Object.values(MuscleTarget) }, example: [MuscleTarget.CHEST] })
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
  @ApiProperty({ type: 'array', items: { type: 'string', enum: Object.values(ExerciseType) }, example: [ExerciseType.STRENGTH] })
  exerciseType: ExerciseType[];

  @IsArray()
  @IsEnum(SetType, {
    each: true,
    message: `Each setType must be one of: ${Object.values(
      SetType,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({ type: 'array', items: { type: 'string', enum: Object.values(SetType) }, example: [SetType.EFFECTIVE] })
  setType: SetType[];
}

export class Exercise extends ExerciseRequest {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ExerciseUpdate {
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

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  video?: string;

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
  exerciseType?: ExerciseType[];

  @IsArray()
  @IsEnum(SetType, {
    each: true,
    message: `Each setType must be one of: ${Object.values(
      SetType,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @IsOptional()
  @ArrayMinSize(1)
  setType?: SetType[];
}
