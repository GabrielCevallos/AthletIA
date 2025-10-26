import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { RoutineGoal } from 'src/workout/routines/enum/routine-goal.enum';

export class ProfileRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsNumberString()
  @Length(10)
  phoneNumber: string;

  @IsNotEmpty({ each: true })
  @IsEnum(RoutineGoal, {
    each: true,
    message: 'Each fit goal must be one of: "lose_weight", "build_muscle", "improve_endurance", "increase_flexibility"',
  })
  fitGoals: RoutineGoal[];

  @IsEnum(Gender, {
    message: 'Gender must be one of: "male", "female"',
  })
  gender: Gender;
}

export class ProfileUpdate {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  birthDate: Date;

  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsEnum(RoutineGoal, {
    each: true,
    message: 'Each fit goal must be one of: "lose_weight", "build_muscle", "improve_endurance", "increase_flexibility"',
  })
  fitGoals: RoutineGoal[];


  @IsNumberString()
  @Length(10)
  @IsOptional()
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
