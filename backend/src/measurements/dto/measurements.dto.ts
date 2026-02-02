import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Check } from 'typeorm/browser';
import { CheckTime } from '../enum/check-time.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeasurementRequest {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'User weight in kg', type: Number, example: 75.5 })
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'User height in cm', type: Number, example: 180 })
  height: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left arm measurement in cm', type: Number })
  left_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right arm measurement in cm', type: Number })
  right_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left forearm measurement in cm', type: Number })
  left_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right forearm measurement in cm', type: Number })
  right_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Clavicular width in cm', type: Number })
  clavicular_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Neck diameter in cm', type: Number })
  neck_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Chest size in cm', type: Number })
  chest_size?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Back width in cm', type: Number })
  back_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Hip diameter in cm', type: Number })
  hip_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left leg measurement in cm', type: Number })
  left_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right leg measurement in cm', type: Number })
  right_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left calve measurement in cm', type: Number })
  left_calve?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right calve measurement in cm', type: Number })
  right_calve?: number;

  @IsNotEmpty()
  @Type(() => String)
  @IsEnum(CheckTime, { 
    each: true,
    message: `Check Time must be one of: ${Object.values(
      CheckTime,
    ).join(', ')}`,
  })
  @ApiProperty({ 
    description: 'Check time - Valid values: WEEKLY, MONTHLY, YEARLY', 
    enum: CheckTime, 
    example: CheckTime.WEEKLY 
  })
  checkTime: string;
}
export class Measurement {
  @IsUUID()
  @ApiProperty({ description: 'Measurement ID', format: 'uuid' })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'User weight in kg', type: Number, example: 75.5 })
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'User height in cm', type: Number, example: 180 })
  height: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left arm measurement in cm', type: Number })
  left_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right arm measurement in cm', type: Number })
  right_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left forearm measurement in cm', type: Number })
  left_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right forearm measurement in cm', type: Number })
  right_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Clavicular width in cm', type: Number })
  clavicular_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Neck diameter in cm', type: Number })
  neck_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Chest size in cm', type: Number })
  chest_size?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Back width in cm', type: Number })
  back_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Hip diameter in cm', type: Number })
  hip_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left leg measurement in cm', type: Number })
  left_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right leg measurement in cm', type: Number })
  right_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left calve measurement in cm', type: Number })
  left_calve?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right calve measurement in cm', type: Number })
  right_calve?: number;

  @IsNotEmpty()
  @Type(() => String)
  @IsEnum(CheckTime, { 
    each: true,
    message: `Check Time must be one of: ${Object.values(
      CheckTime,
    ).join(', ')}`,
  })
  @ApiProperty({ 
    description: 'Check time - Valid values: WEEKLY, MONTHLY, YEARLY', 
    enum: CheckTime, 
    example: CheckTime.WEEKLY 
  })
  checkTime: string;

  @IsDate()
  @ApiProperty({ description: 'Creation date', type: Date })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: 'Last update date', type: Date })
  updatedAt: Date;
}

export class MeasurementUpdate {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'User weight in kg', type: Number, example: 75.5 })
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'User height in cm', type: Number, example: 180 })
  height?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left arm measurement in cm', type: Number })
  left_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right arm measurement in cm', type: Number })
  right_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left forearm measurement in cm', type: Number })
  left_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right forearm measurement in cm', type: Number })
  right_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Clavicular width in cm', type: Number })
  clavicular_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Neck diameter in cm', type: Number })
  neck_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Chest size in cm', type: Number })
  chest_size?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Back width in cm', type: Number })
  back_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Hip diameter in cm', type: Number })
  hip_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left leg measurement in cm', type: Number })
  left_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right leg measurement in cm', type: Number })
  right_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Left calve measurement in cm', type: Number })
  left_calve?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Right calve measurement in cm', type: Number })
  right_calve?: number;

  @IsOptional()
  @Type(() => String)
  @IsEnum(CheckTime, { 
    each: true,
    message: `Check Time must be one of: ${Object.values(
      CheckTime,
    ).join(', ')}`,
  })
  @ApiPropertyOptional({ 
    description: 'Check time - Valid values: WEEKLY, MONTHLY, YEARLY', 
    enum: CheckTime, 
    example: CheckTime.WEEKLY 
  })
  checkTime?: string;
}

export class MyMeasurementResponse {
  @IsUUID()
  @ApiProperty({ description: 'Measurement ID', format: 'uuid' })
  id: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'User weight in kg', type: Number, example: 75.5 })
  weight: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'User height in cm', type: Number, example: 180 })
  height: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Body Mass Index', type: Number, example: 23.3 })
  imc: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  left_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  right_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  left_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  right_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clavicular_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  neck_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  chest_size?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  back_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hip_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  left_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  right_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  left_calve?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  right_calve?: number;

  @Type(() => String)
  @IsEnum(CheckTime)
  @ApiProperty({ 
    description: 'Check time - Valid values: WEEKLY, MONTHLY, YEARLY', 
    enum: CheckTime, 
    example: CheckTime.WEEKLY 
  })
  checkTime: string;

  @IsDate()
  @ApiProperty({ description: 'Creation date', type: Date })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: 'Last update date', type: Date })
  updatedAt: Date;
}
