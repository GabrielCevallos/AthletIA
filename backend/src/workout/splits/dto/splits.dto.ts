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
import { Days } from '../enum/days.enum';
import { Routine } from '../../routines/routines.entity';

export class SplitRequest {
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
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  routineIds?: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Days, {
    each: true,
    message: `Each day must be one of: ${Object.values(
      Days,
    ).join(', ')}`,
  })
  @ArrayMinSize(1)
  trainingDays: Days[];

  @IsBoolean()
  official: boolean;
}

export class Split extends SplitRequest {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  routines?: Routine[];
}

export class SplitUpdate {
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
  routineIds?: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Days, {
    each: true,
    message: `Each day must be one of: ${Object.values(
      Days,
    ).join(', ')}`,
  })
  @IsOptional()
  @ArrayMinSize(1)
  trainingDays?: Days[];

  @IsBoolean()
  @IsOptional()
  official?: boolean;
}