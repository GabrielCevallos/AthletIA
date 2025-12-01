import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class ProfileRequest {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsNumberString()
  @Length(10)
  phoneNumber: string;

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
