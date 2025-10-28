import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../enum/gender.enum';
import { RoutineGoal } from 'src/workout/routines/enum/routine-goal.enum';

export class ProfileRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ format: 'date' })
  birthDate: Date;

  @IsNumberString()
  @Length(10)
  @ApiProperty({ description: 'Numeric string length 10' })
  phoneNumber: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsEnum(RoutineGoal, {
    each: true,
    message: 'Each fit goal must be one of: "weight_loss", "build_muscle", "improve_endurance", "increase_flexibility"',
  })
  @ApiProperty({ type: 'array', items: { type: 'string', enum: Object.values(RoutineGoal) } })
  fitGoals: RoutineGoal[];

  @IsEnum(Gender, {
    message: 'Gender must be one of: "male", "female"',
  })
  @ApiProperty({ enum: Object.values(Gender) })
  gender: Gender;
}

export class ProfileUpdate {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ format: 'date' })
  birthDate: Date;

  @IsOptional()
  @ArrayNotEmpty({ each: true })
  @IsArray()
  @IsEnum(RoutineGoal, {
    each: true,
    message: 'Each fit goal must be one of: "lose_weight", "build_muscle", "improve_endurance", "increase_flexibility"',
  })
  @ApiPropertyOptional({ type: 'array', items: { type: 'string', enum: Object.values(RoutineGoal) } })
  fitGoals: RoutineGoal[];


  @IsNumberString()
  @Length(10)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Numeric string length 10' })
  phoneNumber: string;
}

export class Profile extends ProfileRequest {
  email: string;
  createdAt: Date;
  updatedAt: Date;
  age: number;
}

export class UserItem {
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
}
