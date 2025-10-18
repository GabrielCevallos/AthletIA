import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { MuscleTarget } from '../enum/muscle-target.enum';
import { ExerciseType } from '../enum/exercise-type.enum';

export class ExerciseRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  video: string;

  @IsArray()
  @IsEnum(MuscleTarget, {
    each: true,
    message: `Each muscleTarget must be one of: ${Object.values(MuscleTarget).join(', ')}`,
  })
  @IsNotEmpty()
  muscleTarget: MuscleTarget[];

  @IsArray()
  @IsEnum(ExerciseType, {
    each: true,
    message: `Each exerciseType must be one of: ${Object.values(ExerciseType).join(', ')}`,
  })
  @IsNotEmpty()
  exerciseType: ExerciseType[];
}

export class Exercise extends ExerciseRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ExerciseUpdate {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  video?: string;

  @IsArray()
  @IsEnum(MuscleTarget, {
    each: true,
    message: `Each muscleTarget must be one of: ${Object.values(MuscleTarget).join(', ')}`,
  })
  @IsNotEmpty()
  @IsOptional()
  muscleTarget?: MuscleTarget[];

  @IsArray()
  @IsEnum(ExerciseType, {
    each: true,
    message: `Each exerciseType must be one of: ${Object.values(ExerciseType).join(', ')}`,
  })
  @IsNotEmpty()
  @IsOptional()
  exerciseType?: ExerciseType[];
}
