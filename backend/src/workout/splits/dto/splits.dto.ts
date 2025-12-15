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
import { Days } from '../enum/days.enum';
import { Routine } from '../../routines/routines.entity';

export class SplitRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ description: 'Split name', minLength: 3, maxLength: 50, example: 'Upper/Lower' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  @ApiProperty({ description: 'Split description', minLength: 10, maxLength: 500, example: '4-day weekly program split into upper and lower.' })
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @ApiProperty({ description: 'Included routine IDs', type: [String], format: 'uuid', required: false })
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
  @ApiProperty({ description: 'Training days', enum: Days, isArray: true })
  trainingDays: Days[];

  @IsBoolean()
  @ApiProperty({ description: 'Official split flag', example: false })
  official: boolean;
}

export class Split extends SplitRequest {
  @IsUUID()
  @ApiProperty({ description: 'Split ID', format: 'uuid' })
  id: string;

  @IsDate()
  @ApiProperty({ description: 'Creation date', type: Date })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: 'Last update date', type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Included routines' })
  routines?: Routine[];
}

export class SplitUpdate {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @ApiPropertyOptional({ description: 'Split name', minLength: 3, maxLength: 50 })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(10)
  @MaxLength(500)
  @ApiPropertyOptional({ description: 'Split description', minLength: 10, maxLength: 500 })
  description?: string;

  @IsOptional()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({ description: 'Included routine IDs', type: [String], format: 'uuid' })
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
  @ApiPropertyOptional({ description: 'Training days', enum: Days, isArray: true })
  trainingDays?: Days[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Official split flag', example: false })
  official?: boolean;
}