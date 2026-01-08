import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Check } from 'typeorm/browser';
import { CheckTime } from '../enum/check-time.enum';

export class MeasurementRequest {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  height: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  clavicular_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  neck_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  chest_size?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  back_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  hip_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_calve?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_calve?: number;

  @IsNotEmpty()
  @Type(() => String)
  @IsEnum(CheckTime, { 
    each: true,
    message: `Check Time must be one of: ${Object.values(
      CheckTime,
    ).join(', ')}`,
  })
  checkTime: string;
}

export class Measurement extends MeasurementRequest {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class MeasurementUpdate {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_arm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_forearm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  clavicular_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  neck_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  chest_size?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  back_width?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  hip_diameter?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_leg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  left_calve?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  right_calve?: number;

  @IsOptional()
  @Type(() => String)
  @IsEnum(CheckTime, { 
    each: true,
    message: `Check Time must be one of: ${Object.values(
      CheckTime,
    ).join(', ')}`,
  })
  checkTime?: string;
}

export class MyMeasurementResponse {
  @IsUUID()
  id: string;

  @IsNumber()
  @Type(() => Number)
  weight: number;

  @IsNumber()
  @Type(() => Number)
  height: number;

  @IsNumber()
  @Type(() => Number)
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
  checkTime: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
