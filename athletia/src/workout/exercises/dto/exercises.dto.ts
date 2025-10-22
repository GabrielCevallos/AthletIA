import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MuscleTarget } from '../enum/muscle-target.enum';
import { ExerciseType } from '../enum/exercise-type.enum';

export class ExerciseRequest {
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

  @IsUrl()
  @IsNotEmpty()
  video: string;

  @IsArray()
  @IsEnum(MuscleTarget, {
    each: true,
    message: `Each muscleTarget must be one of: ${Object.values(
      MuscleTarget,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
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
  exerciseType: ExerciseType[];
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
}
