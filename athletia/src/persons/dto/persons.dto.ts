import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';

//TODO: CHANGE DATE VALIDATION TO CUSTOM VALIDATOR

export class ProfileRequest {
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'birthDate must be in the format MM/dd/yyyy',
  })
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
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'birthDate must be in the format MM/dd/yyyy',
  })
  birthDate: Date;

  @IsNumberString()
  @Length(10)
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
