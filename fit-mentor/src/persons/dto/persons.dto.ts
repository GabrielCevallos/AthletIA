import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class ProfileRequest {
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'birthDate must be in the format dd/MM/yyyy',
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
  name: string;
  birthDate: Date;
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
