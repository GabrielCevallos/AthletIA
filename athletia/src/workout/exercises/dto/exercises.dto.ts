import {
<<<<<<< HEAD
  IsArray,
=======
  ArrayMinSize,
  IsArray,
  IsDate,
>>>>>>> 7cd40a95bddcc5373169e9df425d6b320fab7f64
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
<<<<<<< HEAD
=======
  IsUUID,
  MaxLength,
  MinLength,
>>>>>>> 7cd40a95bddcc5373169e9df425d6b320fab7f64
} from 'class-validator';
import { MuscleTarget } from '../enum/muscle-target.enum';
import { ExerciseType } from '../enum/exercise-type.enum';

export class ExerciseRequest {
  @IsString()
  @IsNotEmpty()
<<<<<<< HEAD
=======
  @MinLength(3)
  @MaxLength(50)
>>>>>>> 7cd40a95bddcc5373169e9df425d6b320fab7f64
  name: string;

  @IsString()
  @IsNotEmpty()
<<<<<<< HEAD
=======
  @MinLength(10)
  @MaxLength(500)
>>>>>>> 7cd40a95bddcc5373169e9df425d6b320fab7f64
  description: string;

  @IsUrl()
  @IsNotEmpty()
  video: string;

  @IsArray()
  @IsEnum(MuscleTarget, {
    each: true,
<<<<<<< HEAD
    message: `Each muscleTarget must be one of: ${Object.values(MuscleTarget).join(', ')}`,
  })
  @IsNotEmpty()
=======
    message: `Each muscleTarget must be one of: ${Object.values(
      MuscleTarget,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
>>>>>>> 7cd40a95bddcc5373169e9df425d6b320fab7f64
  muscleTarget: MuscleTarget[];

  @IsArray()
  @IsEnum(ExerciseType, {
    each: true,
<<<<<<< HEAD
    message: `Each exerciseType must be one of: ${Object.values(ExerciseType).join(', ')}`,
  })
  @IsNotEmpty()
=======
    message: `Each exerciseType must be one of: ${Object.values(
      ExerciseType,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
>>>>>>> 7cd40a95bddcc5373169e9df425d6b320fab7f64
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
