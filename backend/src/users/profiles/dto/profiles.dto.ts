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
  @ApiProperty({ description: 'Full name', example: 'Jane Doe' })
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Birth date in ISO format',
    example: '1990-01-01',
  })
  birthDate: Date;

  @IsNumberString()
  @Length(10)
  @ApiProperty({ description: '10-digit phone number', example: '5512345678' })
  phoneNumber: string;

  @IsEnum(Gender, {
    message: 'Gender must be one of: "male", "female"',
  })
  @ApiProperty({ description: 'Gender', enum: Gender })
  gender: Gender;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoutineGoal, { each: true })
  @ApiProperty({
    description: 'Fitness goals',
    isArray: true,
    example: ['lose_weight', 'build_muscle'],
  })
  fitGoals: RoutineGoal[];
}

export class ProfileUpdate {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Full name', example: 'Jane Doe' })
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Birth date in ISO format',
    example: '1990-01-01',
  })
  birthDate: Date;

  @IsNumberString()
  @Length(10)
  @IsOptional()
  @ApiPropertyOptional({
    description: '10-digit phone number',
    example: '5512345678',
  })
  phoneNumber: string;
}

export class Profile extends ProfileRequest {
  @ApiProperty({ description: 'Associated email', example: 'user@example.com' })
  email: string;
  @ApiProperty({ description: 'Creation date', type: Date })
  createdAt: Date;
  @ApiProperty({ description: 'Last update date', type: Date })
  updatedAt: Date;
  @ApiProperty({ description: 'Calculated age', example: 30 })
  age: number;
}

export class UserItem {
  @ApiProperty({ description: 'Full name', example: 'Jane Doe' })
  name: string;
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
  @ApiProperty({ description: 'Phone number', example: '5512345678' })
  phoneNumber: string;
  @ApiProperty({ description: 'Age', example: 30 })
  age: number;
}
