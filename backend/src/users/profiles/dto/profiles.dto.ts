import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../enum/gender.enum';
import { Language } from '../enum/language.enum';
import { RoutineGoal } from 'src/workout/routines/enum/routine-goal.enum';

export class NotificationPreferencesDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Receive routine notifications', example: true })
  routines?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Receive exercise notifications', example: true })
  exercises?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Receive system notifications', example: true })
  system?: boolean;
}

export class ProfileRequest {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ description: 'Full name', example: 'Jane Doe' })
  name: string;

  @IsNotEmpty({ message: 'Birth date is required' })
  @IsDateString({}, { message: 'Birth date must be a valid ISO date' })
  @ValidateIf((o) => {
    const birthDate = new Date(o.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  }, { message: 'Must be at least 18 years old' })
  @ApiProperty({
    description: 'Birth date in ISO format (user must be 18+)',
    example: '1990-01-01',
  })
  birthDate: Date;

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be exactly 10 digits' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  @ApiProperty({ description: '10-digit phone number', example: '5512345678' })
  phoneNumber: string;

  @IsEnum(Language, {
    message: 'Language must be one of: "english", "spanish"',
  })
  @ApiProperty({
    description: 'Language preference - Valid values: english, spanish',
    enum: Language,
    example: Language.SPANISH,
  })
  language: Language;

  @IsEnum(Gender, {
    message: 'Gender must be one of: "male", "female"',
  })
  @ApiProperty({ 
    description: 'Gender - Valid values: male, female', 
    enum: Gender,
    example: Gender.MALE,
  })
  gender: Gender;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoutineGoal, { each: true })
  @ApiProperty({
    description: 'Fitness goals - Valid values: weight_loss, muscle_gain, weight_maintenance, endurance, flexibility, general_fitness, rehabilitation, improved_posture, balance_and_coordination, cardiovascular_health, strength_training, athletic_performance, lifestyle_enhancement',
    isArray: true,
    enum: RoutineGoal,
    example: ['weight_loss', 'muscle_gain'],
  })
  fitGoals: RoutineGoal[];
}

export class ProfileUpdate {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({ description: 'Full name', example: 'Jane Doe' })
  name?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Birth date must be a valid ISO date' })
  @ValidateIf((o) => {
    if (o.birthDate === undefined) return false;
    const birthDate = new Date(o.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  }, { message: 'Must be at least 18 years old' })
  @ApiPropertyOptional({
    description: 'Birth date in ISO format (user must be 18+)',
    example: '1990-01-01',
  })
  birthDate?: Date;

  @IsOptional()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be exactly 10 digits' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  @ApiPropertyOptional({
    description: '10-digit phone number',
    example: '5512345678',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(Language, {
    message: 'Language must be one of: "english", "spanish"',
  })
  @ApiPropertyOptional({
    description: 'Language preference - Valid values: english, spanish',
    enum: Language,
    example: Language.SPANISH,
  })
  language?: Language;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  @ApiPropertyOptional({ description: 'Notification preferences' })
  notificationPreferences?: NotificationPreferencesDto;
}

export class Profile {
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

  @IsEnum(Language, {
    message: 'Language must be one of: "english", "spanish"',
  })
  @ApiProperty({
    description: 'Language preference - Valid values: english, spanish',
    enum: Language,
    example: Language.SPANISH,
  })
  language: Language;

  @IsEnum(Gender, {
    message: 'Gender must be one of: "male", "female"',
  })
  @ApiProperty({ 
    description: 'Gender - Valid values: male, female', 
    enum: Gender,
    example: Gender.MALE,
  })
  gender: Gender;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoutineGoal, { each: true })
  @ApiProperty({ description: 'Fitness goals - Valid values: weight_loss, muscle_gain, weight_maintenance, endurance, flexibility, general_fitness, rehabilitation, improved_posture, balance_and_coordination, cardiovascular_health, strength_training, athletic_performance, lifestyle_enhancement',
    isArray: true,
    enum: RoutineGoal,
    example: ['weight_loss', 'muscle_gain'],
  })
  fitGoals: RoutineGoal[];

  @ApiProperty({ description: 'Current streak of consecutive days', example: 5 })
  currentStreak: number;

  @ApiProperty({ description: 'Maximum streak achieved', example: 10 })
  maxStreak: number;

  @ApiProperty({ description: 'Associated email', example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Notification preferences' })
  notificationPreferences?: NotificationPreferencesDto;

  @ApiPropertyOptional({ description: 'Last recorded weight in kg', example: 75.5 })
  lastWeight?: number;

  @ApiProperty({ description: 'Creation date', type: Date, example: '2024-01-01T12:00:00Z' })
  createdAt: Date;
  @ApiProperty({ description: 'Last update date', type: Date, example: '2024-01-02T12:00:00Z' })
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
